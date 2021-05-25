import {
  Post,
  Controller,
  Get,
  Req,
  Res,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { endWithInternalServerError } from './../utils/Http';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import LoginUserDto from './dto/LoginUserDto';
import { User } from './user.decorator';
import OperationResult from '@/shared/models/OperationResult';
import ToggleUserFollowDto from './dto/ToggleUserFollowDto';
import UserDto from './dto/UserDto';
import { UserSnippetDto } from './dto/UserSnippetDto';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('v1/auth/register')
  async register(@Req() req: Request, @Res() res: Response): Promise<any> {
    const result = await this.userService.register(req.body);
    if (result.status === 'ERROR') {
      throw new HttpException(
        { errors: result.error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (result.status === 'SUCCESS') {
      const token = this.userService.generateJWT(result.data);
      res.send({
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        token: token,
      });
      // return req.logIn(result.data, (err) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   return res.send({ ...(result.data as any).dataValues, hash: null });
      // });
    }
  }

  @Post('v1/auth/forgot-password')
  async forgotPassword(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.userService.forgotPassword(req.body.email);
    if (result.status === 'NOT_FOUND') {
      return res.status(HttpStatus.NOT_FOUND).end();
    } else if (result.status === 'SUCCESS') {
      res.send({ message: 'Recovery token sent successfully!' });
    } else {
      endWithInternalServerError(res, result.error);
    }
  }

  @Post('v1/auth/reset-password')
  async resetPassword(@Req() req: Request, @Res() res: Response): Promise<any> {
    const result = await this.userService.resetPassword(req.body);
    if (result.status === 'NOT_FOUND') {
      return res.status(HttpStatus.NOT_FOUND).end();
    } else {
      res.send({ message: 'Password reset successfully!' });
    }
  }

  //@UsePipes(new ValidationPipe())
  @Post('v1/auth/login')
  async login(@Body() loginDto: LoginUserDto): Promise<any> {
    const result = await this.userService.localLogin(
      loginDto.email,
      loginDto.password,
    );
    if (result.status === 'SUCCESS') {
      const token = await this.userService.generateJWT(result.data);
      return {
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        token: token,
      };
    } else {
      throw new HttpException({ errors: result.error }, 401);
    }

    // return passport.authenticate("local", (err, user, info) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   if (!user) {
    //     return res.status(HttpStatus.UNAUTHORIZED).send({
    //       errors: [!!info ? info.message : "Incorrect email or password!"],
    //     });
    //   }
    //   req.logIn(user, (err) => {
    //     if (err) {
    //       return next(err);
    //     }
    //     return res.send({ ...user.dataValues, hash: null });
    //   });
    // })(req, res, next);
  }

  @Post('v1/auth/facebook')
  async facebookLogin(
    @Req() req: Request,
    @Res() _res: Response,
  ): Promise<any> {
    const result = await this.userService.facebookLogin(req.body.token);

    if (result.status === 'SUCCESS') {
      const token = await this.userService.generateJWT(result.data);
      return _res.send({
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        token: token,
      });
    } else {
      throw new HttpException({ errors: result.error }, 401);
    }

    // if (result.status === "NO_DATA") {
    //   res
    //     .status(HttpStatus.BAD_REQUEST)
    //     .send({ errors: [getStatusText(HttpStatus.BAD_REQUEST)] });
    // } else if (result.status === "ERROR") {
    //   endWithInternalServerError(res, result.error);
    // } else {
    //   res.send((result.data as any).dataValues);
    // }
  }

  @Post('v1/auth/google')
  async googleLogin(@Req() req: Request, @Res() _res: Response): Promise<any> {
    const result = await this.userService.googleLogin(req.body.token);

    if (result.status === 'SUCCESS') {
      const token = await this.userService.generateJWT(result.data);
      _res.send({
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        token: token,
      });
    } else {
      throw new HttpException({ errors: result.error }, 401);
    }

    // if (result.status === "NO_DATA") {
    //   res
    //     .status(HttpStatus.BAD_REQUEST)
    //     .send({ errors: [getStatusText(HttpStatus.BAD_REQUEST)] });
    // } else if (result.status === "ERROR") {
    //   endWithInternalServerError(res, result.error);
    // } else {
    //   res.send((result.data as any).dataValues);
    // }
  }

  // @Post("v1/auth/logout")
  // async logout(@Req() req: Request, @Res() res: Response) {
  //   if (!req.isAuthenticated || !req.isAuthenticated()) {
  //     res.status(HttpStatus.BAD_REQUEST).end();
  //   }
  //   req.logout();
  //   res.status(HttpStatus.OK).end();
  // }

  @Get('v1/auth/me')
  async getUser(@User('id') userId: string) {
    if (!userId) {
      throw new HttpException({ errors: 'Unauthorized' }, 401);
    }
    const result = this.userService.getUser(userId);
    return result;
  }

  @ApiOperation({ summary: 'Gets user profile details given its Id' })
  @Get('v1/users/:userId/profile')
  async getUserProfile(@Param('userId') userId: string): Promise<any> {
    return await this.userService.getUser(userId);
  }

  @ApiOperation({ summary: 'Updates currently logged in user profile details' })
  @ApiResponse({ status: 201, description: 'Operation result object' })
  @ApiBody({ type: 'UserDto' })
  @Post('v1/users/profile')
  async updateUserProfile(
    @User('id') userId: string,
    @Body() userProfile: UserDto,
  ): Promise<any> {
    userProfile.id = userId;
    return await this.userService.updateUserProfile(userProfile);
  }

  @ApiOperation({ summary: 'Toggles the follow record of a given user' })
  @ApiResponse({ status: 201, description: 'Operation result object' })
  @ApiBody({ type: 'ToggleUserFollowDto' })
  @Post('v1/users/toggle-user-follow')
  async toggleUserFollow(
    @User('id') followerId: string,
    @Body() toggleModel: ToggleUserFollowDto,
  ): Promise<OperationResult> {
    toggleModel.followerId = followerId;
    const result = await this.userService.toggleUserFollow(toggleModel);
    return result;
  }

  @ApiOperation({ summary: 'Gets list of followers for a given user' })
  @ApiResponse({ status: 201, description: 'page of users' })
  @Post('v1/users/:userId/followers')
  async getUserFollowers(
    @Param('userId') userId: string,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<{ count: number; data: UserSnippetDto[] }> {
    const result = await this.userService.getUserFollowers(
      userId,
      pageIndex ?? 1,
      pageSize ?? 10,
    );
    return result;
  }

  @ApiOperation({ summary: 'Gets list of users followed by a given user' })
  @ApiResponse({ status: 201, description: 'page of users' })
  @Post('v1/users/:userId/following')
  async getFollowedUsers(
    @Param('userId') userId: string,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<{ count: number; data: UserSnippetDto[] }> {
    const result = await this.userService.getFollowedUsers(
      userId,
      pageIndex ?? 1,
      pageSize ?? 10,
    );
    return result;
  }

  @ApiOperation({ summary: 'Gets list of followers for a given listing' })
  @ApiResponse({ status: 201, description: 'page of users' })
  @Post('v1/listings/:listingId/followers')
  async getListingFollowers(
    @User('id') userId: string,
    @Param('listingId') listingId: string,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<{ count: number; data: UserSnippetDto[] }> {
    const result = await this.userService.getListingFollowers(
      userId,
      listingId,
      pageIndex ?? 1,
      pageSize ?? 10,
    );
    return result;
  }
}
