import { Injectable, Scope, Logger } from '@nestjs/common';
import * as fs from 'fs';
import env from '@/shared/core/Environment';

const logFile = env.APP_LOG_FILE;

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends Logger {
  error(message: any, trace: string) {
    fs.appendFile(logFile, message, (err) => console.log(err, trace));
  }
}
