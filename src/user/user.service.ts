import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addDays } from 'date-fns';
import crypto from 'crypto';
import { hashSync, compareSync } from 'bcryptjs';
import * as randomstring from 'randomstring';
import {
  RegisterUserDto,
  langEnum,
  AccountTypeEnum,
} from './dto/RegisterUser.dto';
import { AccountTypeProviderEnum } from './dto/SocialLogin.dto';
import ResetPassword from './dto/ResetPassword.dto';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '@/shared/core/prisma.service';
import LoginUserDto from './dto/LoginUser.dto';
import { MailsService } from '@/shared/core/mail.service';
import * as firebaseAdmin from 'firebase-admin';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import OperationResult from '@/shared/models/OperationResult';
import normalizeEmail from '@/utils/Normalize-email';
import { ErrorCodes, MessageCodes } from '@/shared/constants';
import { LocalizationService } from '@/shared/core/localization.service';
@Injectable()
export class UserService {
  constructor(
    private readonly db: PrismaService,
    private readonly mailsService: MailsService,
    private configService: ConfigService,
    private readonly i18n: LocalizationService,
  ) {}

  JWT_SECRET = this.configService.get('JWT_SECRET');

  MASTER_PASS_FOR_SOCIAL_ACCOUNTS = this.configService.get(
    'MASTER_PASS_FOR_SOCIAL_ACCOUNTS',
  );

  ///////////////////////////////////// new - mahmoud done ///////////////////////////////

  async localLogin(body: LoginUserDto) {
    const user = await this.db.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
    }
    const isPasswordCorrect = compareSync(body.password, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException(ErrorCodes.INVALID_PASSWORD);
    }

    delete user.password;
    const token = this.generateJWT(user);
    const refreshToken = await this.generateRefreshToken(user);

    const result = { ...user, token, refreshToken };
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  async socialLogin(idToken: string, socialProvider: AccountTypeProviderEnum) {
    /// verify return data
    const firebaseResponse = await firebaseAdmin.auth().verifyIdToken(idToken);
    console.log(firebaseResponse);
    if (!firebaseResponse.email) {
      // mean invalid idToken
      throw new NotFoundException(ErrorCodes.INVALID_TOKEN);
    }

    const user = await this.db.user.findUnique({
      where: {
        email: normalizeEmail(firebaseResponse.email),
      },
    });

    if (!user) {
      const newUser = {
        name: firebaseResponse.name,

        email: normalizeEmail(firebaseResponse.email),

        photoUrl: firebaseResponse.picture || '',

        password:
          this.MASTER_PASS_FOR_SOCIAL_ACCOUNTS ||
          'MASTER_PASS_FOR_SOCIAL_ACCOUNTS',

        notificationsEnabled: true,

        lang: langEnum.en,

        type: AccountTypeEnum.individual,

        isVerified: true,
      };
      return this.register(newUser, socialProvider);
    }

    delete user.password;
    const token = this.generateJWT(user);
    const refreshToken = await this.generateRefreshToken(user);

    const result = { ...user, token, refreshToken };
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  async register(
    body: RegisterUserDto,
    socialProvider?: AccountTypeProviderEnum,
  ): Promise<any> {
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(
      MessageCodes.EMAIL_VERIFICATION_CODE_SENT,
    );

    const existingUser = await this.db.user.findUnique({
      where: { email: body.email },
    });
    /// after client modification , if the user not verify his account he could regist again with
    /// same email without any server errors .
    /// the only way to vlaidate if email exist iff the email already verified isVerifyed = true
    if (existingUser && existingUser.isVerified == true) {
      throw new BadRequestException(
        ErrorCodes.A_USER_WITH_THIS_EMAIL_ADDRESS_ALREADY_EXISTS,
      );
    } else if (existingUser && existingUser.isVerified == false) {
      //// as client request , if user is not verified server should not save it's data ,
      /// and could regist again with same email witout isssue
      /// for non conflict if the regist with same email and the old not verifiy
      // i will delete the old one to ignore conflict unique in database
      // and continue the regist cycle as normal
      await this.db.user.delete({
        where: { id: existingUser.id },
      });
    }
    /// continue normal cycle
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

    if (user.provider == AccountTypeProviderEnum.local) {
      this.sendVerificationEmail(user.email);
    }
    // @ mail queueAccountTyprProviderEnum
    // if (_user.notificationsEnabled) {
    //   await sendWelcomeNotification(_user.email);
    // }

    delete user.password;
    const token = this.generateJWT(user);
    const refreshToken = await this.generateRefreshToken(user);

    const result = { ...user, token, refreshToken };
    res.data = result;
    return res;
  }

  async resetPassword(body: ResetPassword) {
    const user = await this.db.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
    }
    const isTokenExist = await this.db.userPasswordRecoveryTokens.findFirst({
      where: {
        userId: user.id,
        token: body.token,
      },
    });
    if (!isTokenExist) {
      /// link msg here cause email dynamic link
      throw new NotFoundException(ErrorCodes.INVALID_OR_EXPIRED_LINK);
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
    /// send mail to user that his password has been changed
    this.mailsService.afterResetPasswordEmail(user.name, user.email);

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(
      MessageCodes.PASSWORD_CHANGED_SUCCESSFULLY,
    );
    return res;
  }

  async forgotPassword(email: string): Promise<any> {
    const user = await this.db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
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

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(
      MessageCodes.EMAIL_RESET_PASSWORD_SENT,
    );
    return res;
  }

  async sendVerificationEmail(email: string) {
    const user = await this.db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
    }
    // delete old codes for not reuse it again
    await this.db.userVerificationCode.deleteMany({
      where: {
        userId: user.id,
      },
    });
    const verificationCode = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });
    await this.db.userVerificationCode.create({
      data: {
        userId: user.id,
        code: verificationCode,
      },
    });

    this.mailsService.sendVerificationEmail(
      user.name,
      user.email,
      verificationCode,
    );

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(
      MessageCodes.EMAIL_VERIFICATION_CODE_SENT,
    );
    return res;
  }
  async verifyEmail(email: string, code: string, password: string) {
    const user = await this.db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
    }
    const isCodeExist = await this.db.userVerificationCode.findFirst({
      where: {
        userId: user.id,
        code: code,
      },
    });

    if (!isCodeExist) {
      throw new NotFoundException(ErrorCodes.INVALID_VERIFICATION_CODE);
    }

    await this.db.userVerificationCode.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await this.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });

    /// old - logic to add after disc with mobile , if return user obj in response or login from his side
    //// after client request , the whole user object like login should be returned after verification
    return this.localLogin({ email: email, password: password });
  }

  async getUser(userId: number, myId: number) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
    }
    delete user.password;

    const { followersIds, followedsIds } =
      // get followers / followed of the user
      await this.getFollowersAndFriendsidsHelper(userId);

    const isProfileOwner = myId && myId == userId ? true : false;
    const isFriend = this.isFriend();
    /// here send the followds of the user to check if he follow me
    const isFollower = this.isFollower(myId, followedsIds);
    /// here send the followers of the user to check if i follow him
    const isFollowed = this.isFollowed(myId, followersIds);
    const isSentFriendRequest = this.isSentFriendRequest();
    const isReceivedFriendRequest = this.isReceivedFriendRequest();

    const result = {
      ...user,
      isProfileOwner,
      isFriend,
      isFollower,
      isFollowed,
      isSentFriendRequest,
      isReceivedFriendRequest,
    };

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  public async getUsersList(myId: number, pageIndex: number, pageSize: number) {
    const users = await this.db.user.findMany({
      select: {
        id: true,
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: 'desc',
      },
    });
    const usersCount = await this.db.user.count();

    const usersIds = users.map((e) => e.id);
    const result = await this.getUsersByIds(usersIds, myId);

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    res.meta = { count: usersCount };
    return res;
  }

  public async updateUserProfile(userId: number, body: UpdateUserDto) {
    if (body.email) {
      const existingUser = await this.db.user.findUnique({
        where: { email: body.email },
      });
      if (existingUser.id != userId) {
        /// here to check if the user want to update email with email already exist with another user
        console.log(existingUser.id);
        console.log(userId);
        throw new BadRequestException(
          ErrorCodes.A_USER_WITH_THIS_EMAIL_ADDRESS_ALREADY_EXISTS,
        );
      }
    }
    if (body.password) {
      if (!body.oldPassword) {
        throw new BadRequestException(ErrorCodes.YOU_MUST_ENTER_OLD_PASSWORD);
      }
      const user = await this.db.user.findUnique({
        where: { id: userId },
      });
      const isOldPasswordCorrect = compareSync(body.oldPassword, user.password);

      if (!isOldPasswordCorrect) {
        throw new BadRequestException(ErrorCodes.INVALID_OLD_PASSWORD);
      }
      body.password = hashSync(body.password, 10);
      /// since it's not db model it will cause a prisma error
      delete body.oldPassword;
    }
    const user = await this.db.user.update({
      where: {
        id: userId,
      },
      data: body,
    });

    const token = this.generateJWT(user);
    const refreshToken = await this.generateRefreshToken(user);

    const result = { ...user, token, refreshToken };

    delete result.password;
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
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
      this.JWT_SECRET,
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
      throw new UnauthorizedException(ErrorCodes.INVALID_OR_EXPIRED_TOKEN);
    }

    const user = await this.db.user.findUnique({
      where: {
        id: tokenToFound.userId,
      },
    });

    if (!user) {
      throw new NotFoundException(ErrorCodes.USER_NOT_FOUND);
    }

    /// remove refresh token once it will be used
    await this.db.userRefreshTokens.delete({
      where: { token: tokenToFound.token },
    });

    delete user.password;
    const token = this.generateJWT(user);
    const refreshToken = await this.generateRefreshToken(user);

    const result = { token, refreshToken };
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }
  ////////////////////////////////////// end auth section //////////////////////////////
  public async getUsersByIds(ids: number[], myId: number) {
    const { followersIds, followedsIds } =
      /// if myId sended here mean i want to show another user profile
      // if not , then it mean i want to show my profile
      await this.getFollowersAndFriendsidsHelper(myId);

    const users = await this.db.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
        featuredProductName: true,
        featuredProductId: true,
        lang: true,
        provider: true,
        type: true,
        role: true,
        notificationsEnabled: true,
        followersCount: true,
        storiesCount: true,
        productsCount: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const formatedUsersArr = users.map((user) => {
      const isProfileOwner = myId && myId == user.id ? true : false;
      const isFriend = this.isFriend();
      /// here send the myfollowers check if he follow me
      const isFollower = this.isFollower(user.id, followersIds);
      /// here send the users I follow check if he follow me

      const isFollowed = this.isFollowed(user.id, followedsIds);
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
    });
    return formatedUsersArr;
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
    myId: number,
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
    const result = await this.getUsersByIds(usersIds, myId);

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    res.meta = { count: followersCount };
    return res;
  }

  public async getFollowedUsers(
    userId: number,
    myId: number,
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
    const result = await this.getUsersByIds(usersIds, myId);

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    res.meta = { count: followedsCount };
    return res;
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

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    return res;
  }

  ///////////////////////////////////////// notification section //////////////
  async notificationToken(userId: number, body: string) {
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    const tokenToFound = await this.db.userNotificationTokens.findUnique({
      where: {
        token: body,
      },
    });
    if (tokenToFound) {
      return res;
    }

    /// add new token in db
    await this.db.userNotificationTokens.create({
      data: {
        userId: userId || 0,
        token: body,
      },
    });
    return res;
  }
}
