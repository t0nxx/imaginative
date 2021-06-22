import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';
import { CoreModule } from './../shared/core/core.module';
import { AuthMiddleware } from '@/user/auth.middleware';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [CoreModule, UserModule],
  providers: [LookupsService],
  controllers: [LookupsController],
  exports: [LookupsService],
})
export class LookupsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'v1/lookups/listing-types/:type', method: RequestMethod.GET },
      { path: 'v1/lookups/price-types', method: RequestMethod.GET },
      { path: 'v1/lookups/currencies', method: RequestMethod.GET },
      { path: 'v1/lookups/hiring-types', method: RequestMethod.GET },
      { path: 'v1/lookups/disclaimers', method: RequestMethod.GET },

      { path: 'v1/files/:bucket/:type/upload', method: RequestMethod.POST },
      { path: 'v1/files/:bucket/:type/:name', method: RequestMethod.DELETE },
    );
  }
}
