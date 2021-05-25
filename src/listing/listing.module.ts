import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { CoreModule } from '@/shared/core/core.module';
import { UserModule } from '@/user/user.module';
import { LookupsModule } from '@/lookups/lookups.module';
import { AppLoggerModule } from '@/shared/appLogger/appLogger.module';
import { AuthMiddleware } from '@/user/auth.middleware';

@Module({
  imports: [CoreModule, LookupsModule, UserModule, AppLoggerModule],
  providers: [ListingService],
  controllers: [ListingController],
  exports: [ListingService],
})
export class ListingModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'v1/listings', method: RequestMethod.POST },
      { path: 'v1/listings/:id', method: RequestMethod.PUT },
      { path: 'v1/listings', method: RequestMethod.GET },
      //{path: 'v1/listings/search', method: RequestMethod.POST},
      { path: 'v1/listings/:id', method: RequestMethod.DELETE },
      { path: 'v1/listings/:id', method: RequestMethod.GET },
    );
  }
}