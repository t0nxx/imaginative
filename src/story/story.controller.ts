import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Headers,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { StoryService } from './story.service';
import CreateStoryDto from './dto/CreateStory.dto';
import { User } from '@/user/user.decorator';
import StoryDto from './dto/StoryDto';
import { v4 } from 'uuid';
import { execOperation } from '../utils/Utils';
import SearchStoryDto from './dto/SearchStoryDto';
import { I18nLang } from 'nestjs-i18n';
import { CommentDto } from '@/shared/dto/Comment.dto';

@ApiBearerAuth()
@ApiTags('Stories')
@Controller()
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @ApiOperation({ summary: 'Create new story' })
  @Post('v1/stories')
  async createStory(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Body() storyData: CreateStoryDto,
  ) {
    return this.storyService.addStory(lang, storyData, myId);
  }

  // @Put('v1/stories/:id')
  // async updateStory(
  //   @Headers('lang') lang = 'en',
  //   @Param('id') id: string,
  //   @Body() listingData: CreateStoryDto,
  // ): Promise<StoryDto> {
  //   const story = await this.storyService.updateStory(id, lang, listingData);
  //   return story;
  // }

  @ApiOperation({ summary: 'Gets multiple stories' })
  @Get('v1/stories')
  async getAllStories(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.storyService.getAllStories(
      lang,
      pageIndex ?? 1,
      pageSize ?? 10,
      myId ?? 0,
    );
  }

  // @Post('v1/stories/search')
  // async searchStories(
  //   @User('id') _userId: string,
  //   @Headers('lang') _lang = 'en',
  //   @Body() _searchModel: SearchStoryDto,
  // ): Promise<any> {
  //   const stories = [];
  //   // await this.storyService.searchStories(
  //   //   searchModel,
  //   //   lang,
  //   //   userId,
  //   // );
  //   return stories;
  // }

  @ApiOperation({ summary: 'Gets single story' })
  @Get('v1/stories/:storyId')
  async getStory(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Param('storyId') storyId: number,
  ) {
    /// zero as myid here for vistitors only
    return this.storyService.getStory(storyId, lang, myId ?? 0);
  }
 
  @ApiOperation({ summary: 'Delete A story' })
  @Delete('v1/stories/:storyId')
  async deleteStory(
    @User('id') myId: number,
    @Param('storyId') storyId: number,
  ) {
    return this.storyService.deleteStory(storyId, myId);
  }

  /// story actions like , comment .... etc
  @ApiOperation({ summary: 'Share A story' })
  @Post('v1/stories/:storyId/share')
  async shareStory(@Param('storyId') storyId: number) {
    return this.storyService.shareStory(storyId);
  }

  @ApiOperation({ summary: 'Toggle Like A story' })
  @Post('v1/stories/:storyId/toggle-like')
  async toggleLikeStory(
    @User('id') myId: number,
    @Param('storyId') storyId: number,
  ) {
    return this.storyService.toggleLikeStory(storyId, myId);
  }

  @ApiOperation({ summary: 'Gets Comments Of story' })
  @Get('v1/stories/:storyId/list-comments')
  async getCommentsOfStory(
    @User('id') myId: number,
    @Param('storyId') storyId: number,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.storyService.getCommentsOfStory(
      pageIndex ?? 1,
      pageSize ?? 10,
      myId ?? 0,
      storyId,
    );
  }
  @ApiOperation({ summary: 'Comment On A story' })
  @Post('v1/stories/:storyId/add-comment')
  async addCommentStory(
    @User('id') myId: number,
    @Param('storyId') storyId: number,
    @Body() body: CommentDto,
  ) {
    return this.storyService.addCommentStory(storyId, myId, body.comment);
  }
  @ApiOperation({ summary: 'Update Comment On A story' })
  @Put('v1/stories/:commentId/update-comment')
  async updateCommentStory(
    @User('id') myId: number,
    @Param('commentId') commentId: number,
    @Body() body: CommentDto,
  ) {
    return this.storyService.updateCommentStory(commentId, myId, body.comment);
  }
  @ApiOperation({ summary: 'Delete Comment On A story' })
  @Delete('v1/stories/:commentId/delete-comment')
  async deleteCommentStory(
    @User('id') myId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.storyService.deleteCommentStory(commentId, myId);
  }
}
