import {
  //MiddlewareConsumer,
  Module,
  NestModule,
  //RequestMethod,
} from '@nestjs/common';
import { DevController } from './dev.controller';
import { CoreModule } from './../shared/core/core.module';
import { CacheController } from './cache.controller';

@Module({
  imports: [CoreModule],
  providers: [],
  controllers: [DevController, CacheController],
  exports: [],
})
export class DevModule implements NestModule {
  public configure() {}
}
