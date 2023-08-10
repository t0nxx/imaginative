import { AppCache } from '@/shared/core/Cache';
import { Controller, Delete, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Cache')
@Controller()
export class CacheController {
  constructor() {}

  @Get('v1/cache')
  @ApiOperation({ summary: 'Gets all cached items' })
  async getAllItems(): Promise<any> {
    return AppCache.getCache();
  }

  @Delete('v1/cache')
  @ApiOperation({ summary: 'Deletes all cached items' })
  async clearCache(): Promise<void> {
    AppCache.clear();
  }
}
