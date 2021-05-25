import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
//import { getStatusText, StatusCodes } from "http-status-codes";
import { UserService } from '@/user/user.service';
import * as jwt from 'jsonwebtoken';
import env from '@/shared/core/Environment';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

const JWT_SECRET = env.JWT_SECRET;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await this.userService.getUser(decoded.id);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }

      req.user = user;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
