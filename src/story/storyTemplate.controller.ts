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

  @ApiOperation({ summary: 'Gets single storytemplate' })
  @Get('/:storyTemplateId')
  async getstorytemplate(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Param('storyTemplateId') storytemplateId: number,
  ) {
    /// zero as myid here for vistitors only
    return this.storyService.getStoryTemplate(storytemplateId, lang, myId ?? 0);
  }

  @ApiOperation({ summary: 'Update A storytemplate' })
  @Patch('/:storyTemplateId')
  async updatestorytemplate(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Param('storyTemplateId') storytemplateId: number,
    @Body() storytemplateData: UpdateStoryDto,
  ) {
    return this.storyService.updateStoryTemplate(
      lang,
      storytemplateData,
      storytemplateId,
      myId,
    );
  }

  @ApiOperation({ summary: 'Delete A storytemplate' })
  @Delete('/:storyTemplateId')
  async deletestorytemplate(
    @User('id') myId: number,
    @Param('storyTemplateId') storytemplateId: number,
  ) {
    return this.storyService.deleteStoryTemplate(storytemplateId, myId);
  }
}
