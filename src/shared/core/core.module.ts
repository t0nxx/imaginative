import { Module, NestModule } from '@nestjs/common';
import FireBase from './FireBase';
import MailManager from './MailManager';
import { PrismaService } from './prisma.service';
@Module({
  imports: [],
  providers: [MailManager, FireBase, PrismaService],
  controllers: [],
  exports: [MailManager, FireBase, PrismaService],
})
export class CoreModule implements NestModule {
  public configure() {}
}
