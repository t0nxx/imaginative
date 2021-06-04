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
import LoginUserDto from './dto/LoginUser.dto';
import { User } from './user.decorator';
import OperationResult from '@/shared/models/OperationResult';
import ToggleUserFollowDto from './dto/ToggleUserFollowDto';
import UserDto from './dto/UserDto';
import { UserSnippetDto } from './dto/UserSnippetDto';
import RegisterUserDto from './dto/RegisterUser.dto';
import RefreshTokenDto from './dto/RefreshToken.dto';
import ForgetPasswordDto from './dto/ForgetPassword.dto';
import ResetPasswordDto from './dto/ResetPassword';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('v1/auth/register')
  async register(@Body() body: RegisterUserDto): Promise<any> {
    return this.userService.register(body);
  }

  @Post('v1/auth/login')
  async login(@Body() body: LoginUserDto): Promise<any> {
    return this.userService.localLogin(body);
  }

  @Post('v1/auth/refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<any> {
    return this.userService.refreshToken(body.refreshToken);
  }

  @Post('v1/auth/forgot-password')
  async forgotPassword(@Body() body: ForgetPasswordDto) {
    return this.userService.forgotPassword(body.email);
  }

  @Post('v1/auth/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto): Promise<any> {
    await this.userService.resetPassword(body);
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
