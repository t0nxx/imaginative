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
  public configure() {}
}
