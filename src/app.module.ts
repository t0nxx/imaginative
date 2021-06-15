import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ListingModule } from './listing/listing.module';
import { DevModule } from './dev/dev.module';
import { LookupsModule } from './lookups/lookups.module';
import { AppLoggerModule } from './shared/appLogger/appLogger.module';
import { StoryModule } from './story/story.module';
import { AllExceptionsFilter } from './shared/exception-filters/all-exception-filter-responser';
import { APP_FILTER } from '@nestjs/core';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { LogLevel } from '@sentry/types';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV == 'production' ? '.env.prod' : '.env.dev',
    }),
    // sentry module
    SentryModule.forRoot({
      dsn: 'https://8a07ccff5de9497f923800ed5ef9d435@o412866.ingest.sentry.io/5816558',
      debug: true,
      environment: 'production',
      release: null,
      logLevel: LogLevel.Error,
    }),

    UserModule,
    ListingModule,
    DevModule,
    LookupsModule,
    AppLoggerModule,
    StoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class ApplicationModule {
  constructor() {}
}
