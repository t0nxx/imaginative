import { User } from '@/user/user.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';
import { HomeService } from './home.service';

@Controller('v1/home')
@ApiBearerAuth()
@ApiTags('Home')
export class HomeController {
  constructor(private homeService: HomeService) {}
  @ApiOperation({ summary: 'Gets Home stories and listings' })
  @Get()
  async getHomeStoriesAndListings(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.homeService.getHomeStoriesAndListings(
      lang,
      pageIndex ?? 1,
      pageSize ?? 10,
      myId ?? 0,
    );
  }
}
