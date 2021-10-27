import { Module, NestModule } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MulterExtendedModule } from 'nestjs-multer-extended';

import FireBaseService from './FireBase.service';
import { PrismaService } from './prisma.service';
import { MailsService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { FilesController } from './file.controller';
import { FileService } from './file.service';
import { LocalizationService } from './localization.service';

@Module({
  imports: [
    /// mailer module
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_SERVER'),
          port: configService.get('SMTP_PORT'),
          secure: false, // upgrade later with STARTTLS,
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: '"noreply" <no-reply@imaginativenews.com>',
        },
        preview: true,
        template: {
          /// root of folder
          dir: path.join(__dirname, '..', '..', '..', 'mail-templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

    /// background jobs module
    BullModule.registerQueue({
      name: 'mails',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    //   /// files - aws s3 uploader module
    //   MulterExtendedModule.register({
    //     awsConfig: {
    //       accessKeyId: 'AKIAQQGXQW5BF63COFY5',
    //       secretAccessKey: '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',
    //       region: 'eu-west-3',
    //     },
    //     bucket: 'imaginative-news-files',
    //     basePath: 'uploads',
    //     fileSize: 1 * 1024 * 1024,
    //   }),
  ],
  providers: [
    FireBaseService,
    PrismaService,
    MailsService,
    MailProcessor,
    FileService,
    LocalizationService,
  ],
  controllers: [FilesController],
  exports: [
    MailsService,
    FireBaseService,
    PrismaService,
    FileService,
    LocalizationService,
  ],
})
export class CoreModule implements NestModule {
  public configure() {}
}
