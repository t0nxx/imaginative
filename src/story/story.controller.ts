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

  @ApiOperation({ summary: 'Creates new story' })
  @ApiResponse({
    status: 201,
    description: 'The story has been successfully created.',
  })
  @ApiBody({ type: 'CreateStoryDto' })
  @Post('v1/stories')
  async createStory(
    @Headers('lang') lang = 'en',
    @User('id') userid: string,
    @Body() storyData: CreateStoryDto,
  ): Promise<StoryDto> {
    return await execOperation(async () => {
      storyData.ownerId = userid;
      storyData.id = v4();
      const story = await this.storyService.addStory(lang, storyData);
      return story;
    });
  }

  @ApiOperation({ summary: 'Updates an existing story' })
  @ApiResponse({
    status: 201,
    description: 'The story has been successfully updated.',
  })
  @ApiBody({ type: 'CreateStoryDto' })
  @Put('v1/stories/:id')
  async updateStory(
    @Headers('lang') lang = 'en',
    @Param('id') id: string,
    @Body() listingData: CreateStoryDto,
  ): Promise<StoryDto> {
    const story = await this.storyService.updateStory(id, lang, listingData);
    return story;
  }

  @ApiOperation({ summary: 'Gets all stories' })
  @ApiResponse({ status: 200, description: 'Return all stories' })
  @Get('v1/stories')
  async getAllStories(@Headers('lang') lang = 'en'): Promise<any> {
    const stories = await this.storyService.getAllStories(lang);
    return stories;
  }

  @ApiOperation({ summary: 'Searches stories using provided field criteria' })
  @ApiResponse({ status: 200, description: 'Return all matched stories' })
  @ApiBody({ type: 'SearchStoryDto' })
  @Post('v1/stories/search')
  async searchStories(
    @User('id') userId: string,
    @Headers('lang') lang = 'en',
    @Body() searchModel: SearchStoryDto,
  ): Promise<any> {
    const stories = await this.storyService.searchStories(
      searchModel,
      lang,
      userId,
    );
    return stories;
  }

  @ApiOperation({ summary: 'Gets a story given its id' })
  @ApiResponse({ status: 200, description: 'Returns the story' })
  @Get('v1/stories/:id')
  async getStory(
    @User('id') userId: string,
    @Headers('lang') lang = 'en',
    @Param('id') id: string,
  ): Promise<any> {
    const story = await this.storyService.getStory(id, lang, userId);
    return story;
  }

  @ApiOperation({ summary: 'Deletes a story given its id' })
  @ApiResponse({ status: 200, description: 'Returns Operation Result' })
  @Delete('v1/stories/:id')
  async deleteStory(
    @User('id') userId: string,
    @Param('id') id: string,
  ): Promise<any> {
    const result = await this.storyService.deleteStory(userId, id);
    return result;
  }
}
