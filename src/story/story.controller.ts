import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Headers,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { StoryService } from './story.service';
import CreateStoryDto from './dto/CreateStoryDto';
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

  @Post('v1/stories')
  async createStory(
    @Headers('lang') lang = 'en',
    @User('id') userid: number,
    @Body() storyData: CreateStoryDto,
  ): Promise<StoryDto> {
    return await execOperation(async () => {
      storyData.ownerId = userid;
      const story = await this.storyService.addStory(lang, storyData);
      return story;
    });
  }

  @Put('v1/stories/:id')
  async updateStory(
    @Headers('lang') lang = 'en',
    @Param('id') id: string,
    @Body() listingData: CreateStoryDto,
  ): Promise<StoryDto> {
    const story = await this.storyService.updateStory(id, lang, listingData);
    return story;
  }

  @Get('v1/stories')
  async getAllStories(@Headers('lang') lang = 'en'): Promise<any> {
    const stories = await this.storyService.getAllStories(lang);
    return stories;
  }

  @Post('v1/stories/search')
  async searchStories(
    @User('id') _userId: string,
    @Headers('lang') _lang = 'en',
    @Body() _searchModel: SearchStoryDto,
  ): Promise<any> {
    const stories = [];
    // await this.storyService.searchStories(
    //   searchModel,
    //   lang,
    //   userId,
    // );
    return stories;
  }

  @Get('v1/stories/:id')
  async getStory(
    @User('id') userId: number,
    @Headers('lang') lang = 'en',
    @Param('id') id: number,
  ): Promise<any> {
    const story = await this.storyService.getStory(id, lang, userId);
    return story;
  }

  @Delete('v1/stories/:id')
  async deleteStory(
    @User('id') userId: number,
    @Param('id') id: number,
  ): Promise<any> {
    const result = await this.storyService.deleteStory(userId, id);
    return result;
  }
}
