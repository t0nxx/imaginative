import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ListingModule } from './listing/listing.module';
import { DevModule } from './dev/dev.module';
import { LookupsModule } from './lookups/lookups.module';
import { AppLoggerModule } from './shared/appLogger/appLogger.module';
import { StoryModule } from './story/story.module';
@Module({
  imports: [
    UserModule,
    ListingModule,
    DevModule,
    LookupsModule,
    AppLoggerModule,
    StoryModule,
  ],
  controllers: [],
  providers: [],
})
export class ApplicationModule {
  constructor() {}
}
