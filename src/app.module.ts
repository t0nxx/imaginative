import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ListingModule } from './listing/listing.module';
import { DevModule } from './dev/dev.module';
import { LookupsModule } from './lookups/lookups.module';
import { StoryModule } from './story/story.module';
import { AllExceptionsFilter } from './shared/exception-filters/all-exception-filter-responser';
import { APP_FILTER } from '@nestjs/core';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { LogLevel } from '@sentry/types';
import * as path from 'path';
import {
  I18nModule,
  I18nJsonParser,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import { HomeModule } from './home/home.module';
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
    /// localization module
    I18nModule.forRoot({
      fallbackLanguage: 'ar',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '..', '/i18n/'),
        watch: true,
      },
      /// Accept-Language header
      resolvers: [AcceptLanguageResolver],
    }),

    UserModule,
    ListingModule,
    DevModule,
    LookupsModule,
    StoryModule,
    HomeModule,
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
