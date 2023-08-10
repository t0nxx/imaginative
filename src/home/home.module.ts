import { ListingModule } from '@/listing/listing.module';
import { CoreModule } from '@/shared/core/core.module';
import { StoryModule } from '@/story/story.module';
import { OptionalAuthMiddleware } from '@/user/optional.auth.middleware';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [CoreModule, ListingModule, StoryModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OptionalAuthMiddleware)
      .forRoutes({ path: 'v1/home', method: RequestMethod.GET });
  }
}
