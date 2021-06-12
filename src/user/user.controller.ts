import {
  Post,
  Controller,
  Get,
  Body,
  Param,
  Query,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.decorator';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('/me')
  // async getUser(@User('id') userId: number) {
  //   return this.userService.getUser(userId);
  // }

  @Get('/:userId/profile')
  async getUserProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @User('id') myId: number,
  ) {
    return this.userService.getUser(userId, myId);
  }

  @ApiOperation({ summary: 'Gets list of followers for a given user' })
  @Get('/:userId/followers')
  async getUserFollowers(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.userService.getUserFollowers(
      userId,
      pageIndex ?? 1,
      pageSize ?? 10,
    );
  }

  @ApiOperation({ summary: 'Gets list of users followed by a given user' })
  @Get('/:userId/following')
  async getFollowedUsers(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.userService.getFollowedUsers(
      userId,
      pageIndex ?? 1,
      pageSize ?? 10,
    );
  }

  @ApiOperation({ summary: 'Toggles the follow record of a given user' })
  @Post('/:userId/toggle-user-follow')
  async toggleUserFollow(
    @Param('userId', ParseIntPipe) userId: number,
    @User('id') followerId: number,
  ) {
    return this.userService.toggleUserFollow(userId, followerId);
  }

  @ApiOperation({ summary: 'Updates currently logged in user profile details' })
  @Put('/update')
  async updateUserProfile(
    @User('id') userId: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUserProfile(userId, body);
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
