import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthMiddleware } from './auth.middleware';
import { CoreModule } from './../shared/core/core.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [CoreModule],
  providers: [UserService],
  controllers: [UserController, AuthController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'v1/users/me', method: RequestMethod.GET },

      { path: 'v1/users/:userId/profile', method: RequestMethod.GET },
      // { path: 'v1/users/:userId/followers', method: RequestMethod.GET },
      // { path: 'v1/users/:userId/following', method: RequestMethod.GET },
      {
        path: 'v1/users/:userId/toggle-user-follow',
        method: RequestMethod.POST,
      },

      { path: 'v1/users/add-notifications-token', method: RequestMethod.POST },

      { path: 'v1/users/update', method: RequestMethod.PUT },
    );
  }
}
