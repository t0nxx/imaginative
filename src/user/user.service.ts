import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { addDays } from 'date-fns';
import crypto from 'crypto';
import { hashSync, compareSync } from 'bcryptjs';
import {
  RegisterUserDto,
  langEnum,
  AccountTypeEnum,
} from './dto/RegisterUser.dto';
import { AccountTypeProviderEnum } from './dto/SocialLogin.dto';
import ResetPassword from './dto/ResetPassword.dto';
import env from '@/shared/core/Environment';
import * as jwt from 'jsonwebtoken';
import UserFollower from './../models/UserFollower';
import { UserSnippetDto } from './dto/UserSnippetDto';
import ListingFollower from './../models/ListingFollower';
import { PrismaService } from '@/shared/core/prisma.service';
import LoginUserDto from './dto/LoginUser.dto';
import { MailsService } from '@/shared/core/mail.service';
import * as firebaseAdmin from 'firebase-admin';
import { UpdateUserDto } from './dto/UpdateUser.dto';

const JWT_SECRET = env.JWT_SECRET;
const MASTER_PASS_FOR_SOCIAL_ACCOUNTS = env.MASTER_PASS_FOR_SOCIAL_ACCOUNTS;
@Injectable()
export class UserService {
  constructor(
    private readonly db: PrismaService,
    private readonly mailsService: MailsService,
  ) {}

  /// this fun will be deleted after refactor story / listing
  public async getUserFollowedUsers(
    _followerId: number,
    _userIds: number[],
  ): Promise<Array<number>> {
    // const followings = await UserFollower.findAll({
    //   where: {
    //     followerId: followerId,
    //     userId: userIds,
    //   },
    // });
    // const followings = await this.db.userFollowers.findMany({
    //   where: {
    //     followerId: followerId,
    //     userId: {
    //       in: userIds,
    //     },
    //   },
    // });
    // if (followings) return followings.map((f) => f.userId);
    return [];
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
      // const users = await this.getUsers(followerIds);
      const users = [];
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

  ///////////////////////////////////// new - mahmoud done ///////////////////////////////

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

  async socialLogin(idToken: string, socialProvider: AccountTypeProviderEnum) {
    /// verify return data
    const firebaseResponse = await firebaseAdmin.auth().verifyIdToken(idToken);
    console.log(firebaseResponse);
    if (!firebaseResponse.email) {
      // mean invalid idToken
      throw new NotFoundException('invalid  token');
    }

    const user = await this.db.user.findFirst({
      where: {
        email: firebaseResponse.email,
        provider: socialProvider,
      },
    });

    if (!user) {
      const newUser = {
        name: firebaseResponse.name,

        email: firebaseResponse.email,

        password:
          MASTER_PASS_FOR_SOCIAL_ACCOUNTS || 'MASTER_PASS_FOR_SOCIAL_ACCOUNTS',

        notificationsEnabled: true,

        lang: langEnum.en,

        type: AccountTypeEnum.individual,
      };
      return this.register(newUser, socialProvider);
    }

    delete user.password;
    const token = this.generateJWT(user);
    const result = { ...user, token };
    return { data: result };
  }

  async register(
    body: RegisterUserDto,
    socialProvider?: AccountTypeProviderEnum,
  ): Promise<any> {
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
      data: {
        ...body,
        /// this line to reuse the whole function in face/google/apple login with same implementation
        provider: socialProvider
          ? socialProvider
          : AccountTypeProviderEnum.local,
      },
    });

    // @ mail queueAccountTyprProviderEnum
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

  async getUser(userId: number, myId: number) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    delete user.password;

    const { followersIds, followedsIds } =
      /// if myId sended here mean i want to show another user profile
      // if not , then it mean i want to show my profile
      await this.getFollowersAndFriendsidsHelper(myId ?? userId);

    const isProfileOwner = myId && myId == userId ? true : false;
    const isFriend = this.isFriend();
    const isFollower = this.isFollower(myId, followersIds);
    const isFollowed = this.isFollowed(myId, followedsIds);
    const isSentFriendRequest = this.isSentFriendRequest();
    const isReceivedFriendRequest = this.isReceivedFriendRequest();

    return {
      ...user,
      isProfileOwner,
      isFriend,
      isFollower,
      isFollowed,
      isSentFriendRequest,
      isReceivedFriendRequest,
    };
  }

  public async updateUserProfile(userId: number, body: UpdateUserDto) {
    if (body.email) {
      const existingUser = await this.db.user.findUnique({
        where: { email: body.email },
      });
      if (existingUser.id != userId) {
        console.log(existingUser.id);
        console.log(userId);
        throw new BadRequestException(
          'A user with this email address already exists!',
        );
      }
    }
    if (body.password) {
      body.password = hashSync(body.password, 10);
    }
    const result = await this.db.user.update({
      where: {
        id: userId,
      },
      data: body,
    });

    delete result.password;
    return { data: result };
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
  ////////////////////////////////////// end auth section //////////////////////////////
  public async getUsersByIds(ids: number[]) {
    const users = await this.db.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        name: true,
        photoUrl: true,
        type: true,
        followersCount: true,
        storiesCount: true,
        productsCount: true,
      },
    });
    return users;
  }

  //////////////////////////////////////// follow / friend section ////////////////////
  //// single responsibility methods , return true or false
  public isFollower(myId: number, followersIds: number[]) {
    return followersIds.some((e) => e == myId);
  }
  public isFollowed(myId: number, followedsIds: number[]) {
    return followedsIds.some((e) => e == myId);
  }
  public isFriend() {
    // to be implemented later
    // return frindsIds.some((e) => e == myId);
    return false;
  }
  public isSentFriendRequest() {
    // to be implemented later
    // return frindsIds.some((e) => e == myId);
    return false;
  }
  public isReceivedFriendRequest() {
    // to be implemented later
    // return frindsIds.some((e) => e == myId);
    return false;
  }

  public async getFollowersAndFriendsidsHelper(userId: number) {
    /// promise all for better performance in parallel
    const [followers, followeds] = await Promise.all([
      this.db.userFollowers.findMany({
        where: {
          userId: userId,
        },
        select: {
          followerId: true,
        },
      }),
      this.db.userFollowers.findMany({
        where: {
          followerId: userId,
        },
        select: {
          userId: true,
        },
      }),
    ]);

    const followersIds = followers.map((e) => e.followerId);
    const followedsIds = followeds.map((e) => e.userId);
    //// add friendsIds later
    return { followersIds, followedsIds };
  }
  public async getUserFollowers(
    userId: number,
    pageIndex: number,
    pageSize: number,
  ) {
    const followers = await this.db.userFollowers.findMany({
      where: {
        userId: userId,
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });
    const followersCount = await this.db.userFollowers.count({
      where: {
        userId: userId,
      },
    });
    const usersIds = followers.map((e) => e.followerId);
    const users = await this.getUsersByIds(usersIds);
    return {
      count: followersCount,
      data: users,
    };
  }

  public async getFollowedUsers(
    userId: number,
    pageIndex: number,
    pageSize: number,
  ) {
    const followeds = await this.db.userFollowers.findMany({
      where: {
        followerId: userId,
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });
    const followedsCount = await this.db.userFollowers.count({
      where: {
        followerId: userId,
      },
    });

    const usersIds = followeds.map((e) => e.userId);
    const users = await this.getUsersByIds(usersIds);
    return {
      count: followedsCount,
      data: users,
    };
  }
  public async toggleUserFollow(userId: number, followerId: number) {
    const existingFollower = await this.db.userFollowers.findFirst({
      where: {
        userId: userId,
        followerId: followerId,
      },
    });

    if (existingFollower) {
      /// remove follow
      await this.db.userFollowers.delete({
        where: {
          id: existingFollower.id,
        },
      });
      // decrease target user followers by one
      await this.db.user.update({
        where: {
          id: userId,
        },
        data: {
          followersCount: {
            decrement: 1,
          },
        },
      });
    } else {
      /// add follow
      await this.db.userFollowers.create({
        data: {
          userId: userId,
          followerId: followerId,
        },
      });
      // increase target user followers by one
      await this.db.user.update({
        where: {
          id: userId,
        },
        data: {
          followersCount: {
            increment: 1,
          },
        },
      });
      /// @ queue , add to notifications queue
    }

    return { success: true };
  }
}
