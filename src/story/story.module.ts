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
import { OptionalAuthMiddleware } from '@/user/optional.auth.middleware';
import { StoryDraftController } from './storyDraft.controller';
import { StoryTemplateController } from './storyTemplate.controller';

@Module({
  imports: [
    CoreModule,
    LookupsModule,
    UserModule,
    ListingModule,
    AppLoggerModule,
  ],
  providers: [StoryService],
  controllers: [StoryController, StoryDraftController, StoryTemplateController],
  exports: [StoryService],
})
export class StoryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'v1/stories', method: RequestMethod.POST },
        { path: 'v1/stories/:storyId', method: RequestMethod.PATCH },
        { path: 'v1/stories/:storyId', method: RequestMethod.DELETE },

        /// story actions like, comment ..etc
        { path: 'v1/stories/:storyId/toggle-like', method: RequestMethod.POST },
        { path: 'v1/stories/:storyId/add-comment', method: RequestMethod.POST },
        {
          path: 'v1/stories/:commentId/update-comment',
          method: RequestMethod.PUT,
        },
        {
          path: 'v1/stories/:commentId/delete-comment',
          method: RequestMethod.DELETE,
        },

        //// story draft
        { path: 'v1/stories-draft', method: RequestMethod.POST },
        { path: 'v1/stories-draft', method: RequestMethod.GET },

        //// story template
        { path: 'v1/stories-template', method: RequestMethod.GET },

        {
          path: 'v1/stories-template/:storyId',
          method: RequestMethod.POST,
        },
      )
      .apply(OptionalAuthMiddleware)
      .forRoutes(
        { path: 'v1/stories', method: RequestMethod.GET },
        { path: 'v1/stories/search', method: RequestMethod.POST },

        {
          path: 'v1/stories/:storyId/list-comments',
          method: RequestMethod.GET,
        },
        /// share is optional not like (like)
        { path: 'v1/stories/:storyId/share', method: RequestMethod.POST },
        { path: 'v1/stories/:storyId', method: RequestMethod.GET },
      );
  }
}
