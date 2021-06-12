import { Post, Controller, Get, Body, Param, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.decorator';
import OperationResult from '@/shared/models/OperationResult';
import ToggleUserFollowDto from './dto/ToggleUserFollowDto';
import { UserSnippetDto } from './dto/UserSnippetDto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getUser(@User('id') userId: number): Promise<any> {
    return this.userService.getUser(userId);
  }

  @Get('/:userId/profile')
  async getUserProfile(@Param('userId') userId: number): Promise<any> {
    return this.userService.getUser(userId);
  }


  @ApiOperation({ summary: 'Gets list of followers for a given user' })
  @ApiResponse({ status: 201, description: 'page of users' })
  @Get('/:userId/followers')
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
  @Get('/:userId/following')
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

  @ApiOperation({ summary: 'Updates currently logged in user profile details' })
  @Put('/update')
  async updateUserProfile(
    @User('id') userId: number,
    @Body() body: UpdateUserDto,
  ): Promise<any> {
    return await this.userService.updateUserProfile(userId, body);
  }

  @ApiOperation({ summary: 'Toggles the follow record of a given user' })
  @ApiResponse({ status: 201, description: 'Operation result object' })
  @ApiBody({ type: 'ToggleUserFollowDto' })
  @Post('/toggle-user-follow')
  async toggleUserFollow(
    @User('id') followerId: string,
    @Body() toggleModel: ToggleUserFollowDto,
  ): Promise<OperationResult> {
    toggleModel.followerId = followerId;
    const result = await this.userService.toggleUserFollow(toggleModel);
    return result;
  }

  // @ApiOperation({ summary: 'Gets list of followers for a given listing' })
  // @ApiResponse({ status: 201, description: 'page of users' })
  // @Post('/listings/:listingId/followers')
  // async getListingFollowers(
  //   @User('id') userId: string,
  //   @Param('listingId') listingId: string,
  //   @Query('pageIndex') pageIndex?: number,
  //   @Query('pageSize') pageSize?: number,
  // ): Promise<{ count: number; data: UserSnippetDto[] }> {
  //   const result = await this.userService.getListingFollowers(
  //     userId,
  //     listingId,
  //     pageIndex ?? 1,
  //     pageSize ?? 10,
  //   );
  //   return result;
  // }
}
