import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { StoryService } from './story.service';
import { User } from '@/user/user.decorator';
import { I18nLang } from 'nestjs-i18n';
import { UpdateStoryDto } from './dto/UpdateStory.dto';

@ApiBearerAuth()
@ApiTags('Stories-Templates')
@Controller('v1/stories-template')
export class StoryTemplateController {
  constructor(private readonly storyService: StoryService) {}

  @ApiOperation({ summary: 'Create new story template' })
  @Post('/:storyId')
  async createStorytemplate(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Param('storyId') storyId: number,
  ) {
    return this.storyService.addStoryTemplate(lang, storyId, myId);
  }

  @ApiOperation({ summary: 'Gets My Stories Templates ' })
  @Get()
  async getMyStoriesTemplates(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.storyService.getMyStoriesTemplates(
      lang,
      pageIndex ?? 1,
      pageSize ?? 10,
      myId ?? 0,
    );
  }
}
