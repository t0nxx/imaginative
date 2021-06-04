import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import Axios from 'axios';
import { Op } from 'sequelize';
import User from './../models/User';
import { v4 } from 'uuid';
import { addDays } from 'date-fns';
import { sendWelcomeNotification } from '../shared/core/OneSignal';
import { google } from 'googleapis';
import crypto from 'crypto';
import { hashSync, compareSync } from 'bcryptjs';
import IGoogleProfile from './dto/GooglePofile';
import RegisterUser from './dto/RegisterUser.dto';
import ResetPassword from './dto/ResetPassword.dto';
import PasswordRecoveryToken from './../models/PasswordRecoveryToken';
import FireBase from '../shared/core/FireBase.service';
import UserDto from './dto/UserDto';
import env from '@/shared/core/Environment';
import * as jwt from 'jsonwebtoken';
import OperationResult from '@/shared/models/OperationResult';
import UserFollower from './../models/UserFollower';
import ToggleUserFollowDto from './dto/ToggleUserFollowDto';
import sequelize from 'sequelize';
import Listing from './../models/Listing';
import Story from './../models/Story';
import { UserSnippetDto } from './dto/UserSnippetDto';
import ListingFollower from './../models/ListingFollower';
import { PrismaService } from '@/shared/core/prisma.service';
import LoginUserDto from './dto/LoginUser.dto';
import { MailsService } from '@/shared/core/mail.service';
const JWT_SECRET = env.JWT_SECRET;

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2();
// test
@Injectable()
export class UserService {
  constructor(
    private readonly db: PrismaService,
    private readonly mailsService: MailsService,
  ) {}

  async getUser(id: string): Promise<UserDto | null> {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    const prUser = await this.db.user.findFirst({
      where: { id: +id },
    });
    console.log(prUser);

    if (user) {
      const followersCounts = await this.getUsersFollowersCount([user.id]);
      const listings = await Listing.findAndCountAll({
        where: {
          ownerId: user.id,
        },
      });
      const stories = await Story.findAndCountAll({
        where: {
          ownerId: user.id,
        },
      });

      return {
        type: 'user',
        id: user.id,
        name: user.name,
        photoUrl: user.photoUrl,
        featuredProductName: user.featuredProductName,
        featuredProductId: user.featuredProductId,
        followersCount:
          followersCounts && followersCounts.length > 0
            ? followersCounts[0].followersCount
            : 0,
        productsCount: listings ? listings.count : 0,
        storiesCount: stories ? stories.count : 0,
      };
    }
    return null;
  }

  public async updateUserProfile(user: UserDto): Promise<OperationResult> {
    await User.update(user, {
      where: {
        id: user.id,
      },
    });
    const result = new OperationResult();
    result.success = true;
    return result;
  }

  public async toggleUserFollow(
    toggleModel: ToggleUserFollowDto,
  ): Promise<OperationResult> {
    const result = new OperationResult();
    try {
      const existingFollower = await UserFollower.findOne({
        where: {
          userId: toggleModel.userId,
          followerId: toggleModel.followerId,
        },
      });

      if (!existingFollower && toggleModel.isFollowed === true) {
        await UserFollower.create({
          id: v4(),
          userId: toggleModel.userId,
          followerId: toggleModel.followerId,
        });
      } else if (existingFollower && toggleModel.isFollowed === false) {
        await UserFollower.destroy({
          where: {
            id: existingFollower.id,
          },
        });
      }
      result.success = true;
    } catch (error) {
      result.success = false;
      result.message = error;
    }
    return result;
  }

  public async getUserFollowedUsers(
    followerId: string,
    userIds: string[],
  ): Promise<Array<string>> {
    const followings = await UserFollower.findAll({
      where: {
        followerId: followerId,
        userId: userIds,
      },
    });
    if (followings) return followings.map((f) => f.userId);
    return [];
  }

  async getUsers(ids: string[]): Promise<UserDto[] | null> {
    const users = await User.findAll({
      where: {
        id: ids,
      },
    });
    if (users)
      return users.map((user) => ({
        type: 'user',
        id: user.id,
        name: user.name,
        photoUrl: user.photoUrl,
        featuredProductName: user.featuredProductName,
        featuredProductId: user.featuredProductId,
        followersCount: 0,
        productsCount: 0,
        storiesCount: 0,
      }));
    return null;
  }

  async localLogin(body: LoginUserDto): Promise<any> {
    const user = await this.db.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isPasswordCorrect = compareSync(body.password, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException('invalid password');
    }

    delete user.password;
    const token = this.generateJWT(user);
    const refreshToken = await this.generateRefreshToken(user);

    const result = { ...user, token, refreshToken };
    return { data: result };
  }

  async facebookLogin(token: string): Promise<any> {
    try {
      const fbRes = await Axios.get('https://graph.facebook.com/v2.9/me', {
        params: { access_token: token, fields: 'id,name,email' },
      });
      const facebookProfile = fbRes.data;

      let user = await User.findOne({
        where: {
          [Op.or]: [
            { facebookId: facebookProfile.id },
            { email: facebookProfile.email },
          ],
        },
      });

      if (
        !facebookProfile.name ||
        !facebookProfile.email ||
        !facebookProfile.id
      ) {
        return { status: 'NO_DATA' };
      }

      if (!user) {
        user = await User.create({
          id: v4(),
          name: facebookProfile.name,
          email: facebookProfile.email,
          facebookId: facebookProfile.id,
          hash: '',
          notificationsEnabled: false,
        });
      } else if (user.facebookId !== facebookProfile.id) {
        await User.update(
          { facebookId: facebookProfile.id },
          { where: { email: facebookProfile.email } },
        );
      }

      await sendWelcomeNotification(facebookProfile.email);

      return { status: 'SUCCESS', data: user };
    } catch (err) {
      return { status: 'ERROR', error: err };
    }
  }

  async googleLogin(token): Promise<any> {
    try {
      oauth2Client.setCredentials({ access_token: token });
      const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });

      const googleProfile: IGoogleProfile = await new Promise(
        (resolve, reject) => {
          return oauth2.userinfo.get((err, res) => {
            if (err || !res) {
              reject(err);
            } else {
              resolve(res.data);
            }
          });
        },
      );

      let user = await User.findOne({
        where: {
          [Op.or]: [
            { googleId: googleProfile.id },
            { email: googleProfile.email },
          ],
        },
      });

      if (!googleProfile.name || !googleProfile.email || !googleProfile.id) {
        return { status: 'NO_DATA' };
      }

      if (!user) {
        user = await User.create({
          id: v4(),
          name: googleProfile.name,
          email: googleProfile.email,
          googleId: googleProfile.id,
          hash: '',
          notificationsEnabled: false,
        });
      } else if (user.googleId !== googleProfile.id) {
        await User.update(
          { googleId: googleProfile.id },
          { where: { email: googleProfile.email } },
        );
      }

      await sendWelcomeNotification(googleProfile.email);

      return { status: 'SUCCESS', data: user };
    } catch (err) {
      return { status: 'ERROR', error: err };
    }
  }

  async register(body: RegisterUser): Promise<any> {
    const existingUser = await this.db.user.findUnique({
      where: { email: body.email },
    });
    if (existingUser) {
      throw new BadRequestException(
        'A user with this email address already exists!',
      );
    }

    body.password = hashSync(body.password, 10);
    const user = await this.db.user.create({
      data: body,
    });

    // @ mail queue
    // if (_user.notificationsEnabled) {
    //   await sendWelcomeNotification(_user.email);
    // }

    delete user.password;
    const token = this.generateJWT(user);
    const result = { ...user, token };
    return { data: result };
  }

  async resetPassword(body: ResetPassword) {
    const user = await this.db.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isTokenExist = await this.db.userPasswordRecoveryTokens.findFirst({
      where: {
        userId: user.id,
        token: body.token,
      },
    });
    if (!isTokenExist) {
      throw new NotFoundException('invalid reset token');
    }
    const newPass = hashSync(body.newPassword, 10);

    await this.db.user.update({
      where: { id: user.id },
      data: {
        password: newPass,
      },
    });
    /// after change pass remove token to not use it again
    await this.db.userPasswordRecoveryTokens.delete({
      where: { id: isTokenExist.id },
    });

    return { message: 'password changed successfully' };
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // delete old tokens for not reuse it again
    await this.db.userPasswordRecoveryTokens.deleteMany({
      where: {
        userId: user.id,
      },
    });
    const resetCode = crypto.randomBytes(128).toString('hex');
    await this.db.userPasswordRecoveryTokens.create({
      data: {
        userId: user.id,
        token: resetCode,
      },
    });

    this.mailsService.sendResetPasswordEmail(user.name, user.email, resetCode);
    return { message: 'an email has been sent for reset password ' };
  }

  public generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        ...user,
        exp: exp.getTime() / 1000,
      },
      JWT_SECRET,
    );
  }

  public async generateRefreshToken(user) {
    const expireDate = addDays(new Date(), 30);
    const rez = await this.db.userRefreshTokens.create({
      data: { userId: user.id, expireAt: expireDate },
    });
    return rez.token;
  }

  public async getUserFollowers(
    userId: string,
    pageIndex = 1,
    pageSize = 10,
  ): Promise<{ count: number; data: UserSnippetDto[] }> {
    const followers = await UserFollower.findAndCountAll({
      where: {
        userId: userId,
      },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
    });

    const followerIds =
      followers && followers.count > 0
        ? followers.rows.map((f) => f.followerId)
        : [];
    if (followerIds.length > 0) {
      const followeds = await UserFollower.findAll({
        where: {
          userId: followerIds,
          followerId: userId,
        },
      });
      const users = await this.getUsers(followerIds);
      const result: UserSnippetDto[] = users.map((u) => {
        return {
          type: 'user',
          id: u.id,
          name: u.name,
          photoUrl: u.photoUrl,
          featuredProductId: u.featuredProductId,
          featuredProductName: u.featuredProductName,
          isFriend: false,
          isFollower: true,
          isFollowed:
            followeds && followeds.find((f) => f.userId === u.id)
              ? true
              : false,
        };
      });
      return {
        count: followers.count,
        data: result,
      };
    }
    return {
      count: 0,
      data: [],
    };
  }

  public async getFollowedUsers(
    userId: string,
    pageIndex = 1,
    pageSize = 10,
  ): Promise<{ count: number; data: UserSnippetDto[] }> {
    const followeds = await UserFollower.findAndCountAll({
      where: {
        followerId: userId,
      },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
    });

    const followedIds =
      followeds && followeds.count > 0
        ? followeds.rows.map((f) => f.userId)
        : [];
    if (followedIds.length > 0) {
      const followers = await UserFollower.findAll({
        where: {
          followerId: followedIds,
          userId: userId,
        },
      });
      const users = await this.getUsers(followedIds);
      const result: UserSnippetDto[] = users.map((u) => {
        return {
          type: 'user',
          id: u.id,
          name: u.name,
          photoUrl: u.photoUrl,
          featuredProductId: u.featuredProductId,
          featuredProductName: u.featuredProductName,
          isFriend: false,
          isFollower:
            followers && followers.find((f) => f.followerId === u.id)
              ? true
              : false,
          isFollowed: true,
        };
      });
      return {
        count: followeds.count,
        data: result,
      };
    }
    return {
      count: 0,
      data: [],
    };
  }

  public async getListingFollowers(
    userId: string,
    listingId: string,
    pageIndex = 1,
    pageSize = 10,
  ): Promise<{ count: number; data: UserSnippetDto[] }> {
    const followers = await ListingFollower.findAndCountAll({
      where: {
        listingId: listingId,
      },
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize,
    });
    const followerIds =
      followers && followers.count > 0
        ? followers.rows.map((f) => f.userId)
        : [];
    if (followerIds.length > 0) {
      const followeds = userId
        ? await UserFollower.findAll({
            where: {
              userId: followerIds,
              followerId: userId,
            },
          })
        : null;

      const followings = userId
        ? await UserFollower.findAll({
            where: {
              userId: userId,
              followerId: followerIds,
            },
          })
        : null;
      const users = await this.getUsers(followerIds);
      const result: UserSnippetDto[] = users.map((u) => {
        return {
          type: 'user',
          id: u.id,
          name: u.name,
          photoUrl: u.photoUrl,
          featuredProductId: u.featuredProductId,
          featuredProductName: u.featuredProductName,
          isFriend: false,
          isFollower:
            followings && followings.find((f) => f.followerId === u.id)
              ? true
              : false,
          isFollowed:
            followeds && followeds.find((f) => f.userId === u.id)
              ? true
              : false,
        };
      });
      return {
        count: followers.count,
        data: result,
      };
    }
    return {
      count: 0,
      data: [],
    };
  }

  async getUsersFollowersCount(
    userIds: string[],
  ): Promise<{ userId: string; followersCount: number }[]> {
    const result = await UserFollower.findAll({
      attributes: [
        'userId',
        [sequelize.fn('COUNT', 'followerId'), 'followerId'],
      ],
      group: ['userId'],
      where: {
        userId: userIds,
      },
    });
    return result.map((r: any) => ({
      userId: r.userId,
      followersCount: Number(r.followerId),
    }));
  }

  ///////////////////////////////////// new ///////////////////////////////

  async refreshToken(body: string) {
    const tokenToFound = await this.db.userRefreshTokens.findUnique({
      where: {
        token: body,
      },
    });
    if (!tokenToFound) {
      throw new UnauthorizedException('invalid or expired token');
    }

    const user = await this.db.user.findUnique({
      where: {
        id: tokenToFound.userId,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    /// remove refresh token once it will be used
    await this.db.userRefreshTokens.delete({
      where: { token: tokenToFound.token },
    });

    delete user.password;
    const token = this.generateJWT(user);
    const refreshToken = await this.generateRefreshToken(user);

    const result = { token, refreshToken };
    return { data: result };
  }
}
