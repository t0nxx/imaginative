import { Module, NestModule } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { BullModule } from '@nestjs/bull';

import FireBase from './FireBase';
import { PrismaService } from './prisma.service';
import env from '@/shared/core/Environment';
import { MailsService } from './mail.service';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    /// mailer module
    MailerModule.forRoot({
      transport: {
        host: env.SMTP_SERVER,
        port: +env.SMTP_PORT,
        secure: false, // upgrade later with STARTTLS,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      },
      defaults: {
        from: '"noreply" <no-reply@imaginativenews.com>',
      },
      preview: true,
      template: {
        dir: path.join(__dirname, '..', 'mail-templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    /// background jobs module
    BullModule.registerQueue({
      name: 'mails',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [FireBase, PrismaService, MailsService, MailProcessor],
  controllers: [],
  exports: [MailsService, FireBase, PrismaService],
})
export class CoreModule implements NestModule {
  public configure() {}
}
