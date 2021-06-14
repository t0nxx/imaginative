import { Injectable, Scope, Logger } from '@nestjs/common';
import * as fs from 'fs';

const logFile = process.env.APP_LOG_FILE;
@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends Logger {
  error(message: any, trace: string) {
    fs.appendFile(logFile, message, (err) => console.log(err, trace));
  }
}
