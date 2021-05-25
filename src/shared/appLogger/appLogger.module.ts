import { Module } from '@nestjs/common';
import { AppLogger } from './appLogger.service';

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class AppLoggerModule {}
