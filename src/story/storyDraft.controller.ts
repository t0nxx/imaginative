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
import { CreateStoryDraftDto } from './dto/CreateStoryDraft.dto';
import { User } from '@/user/user.decorator';
import { I18nLang } from 'nestjs-i18n';
import { UpdateStoryDto } from './dto/UpdateStory.dto';

@ApiBearerAuth()
@ApiTags('Stories-drafts')
@Controller('v1/stories-draft')
export class StoryDraftController {
  constructor(private readonly storyService: StoryService) {}

  @ApiOperation({ summary: 'Create new storyDraft' })
  @Post()
  async createStoryDraft(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Body() storyDraftData: CreateStoryDraftDto,
  ) {
    return this.storyService.addStoryDraft(lang, storyDraftData, myId);
  }

  @ApiOperation({ summary: 'Gets My Stories Drafts ' })
  @Get()
  async getMyStoriesDrafts(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.storyService.getMyStoriesDrafts(
      lang,
      pageIndex ?? 1,
      pageSize ?? 10,
      myId ?? 0,
    );
  }
}
