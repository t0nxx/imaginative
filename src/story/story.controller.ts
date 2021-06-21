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

@ApiBearerAuth()
@ApiTags('Stories')
@Controller()
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @ApiOperation({ summary: 'Create new story' })
  @Post('v1/stories')
  async createStory(
    @Headers('lang') lang = 'en',
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
    @Headers('lang') lang = 'en',
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
  @Get('v1/stories/:id')
  async getStory(
    @User('id') myId: number,
    @Headers('lang') lang = 'en',
    @Param('id') id: number,
  ) {
    /// zero as myid here for vistitors only
    return this.storyService.getStory(id, lang, myId ?? 0);
  }

  // @Delete('v1/stories/:id')
  // async deleteStory(
  //   @User('id') userId: number,
  //   @Param('id') id: number,
  // ): Promise<any> {
  //   const result = await this.storyService.deleteStory(userId, id);
  //   return result;
  // }
}
