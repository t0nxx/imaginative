import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { PrismaService } from '@/shared/core/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly db: PrismaService,
    private configService: ConfigService,
  ) {}

  JWT_SECRET = this.configService.get('JWT_SECRET');
  async use(req: Request, _res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, this.JWT_SECRET);
      const user = await this.db.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          name: true,
          lang: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }

      req['user'] = user;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
