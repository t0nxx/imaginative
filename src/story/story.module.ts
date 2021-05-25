import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { CoreModule } from '@/shared/core/core.module';
import { UserModule } from '@/user/user.module';
import { LookupsModule } from '@/lookups/lookups.module';
import { AppLoggerModule } from '@/shared/appLogger/appLogger.module';
import { ListingModule } from '@/listing/listing.module';
import { AuthMiddleware } from '@/user/auth.middleware';

@Module({
  imports: [
    CoreModule,
    LookupsModule,
    UserModule,
    ListingModule,
    AppLoggerModule,
  ],
  providers: [StoryService],
  controllers: [StoryController],
  exports: [StoryService],
})
export class StoryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'v1/stories', method: RequestMethod.POST },
      { path: 'v1/stories/:id', method: RequestMethod.PUT },
      { path: 'v1/stories', method: RequestMethod.GET },
      //{path: 'v1/stories/search', method: RequestMethod.POST},
      { path: 'v1/stories/:id', method: RequestMethod.DELETE },
      { path: 'v1/stories/:id', method: RequestMethod.GET },
    );
  }
}
