import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailsService {
  constructor(@InjectQueue('mails') private mailQueue: Queue) {}

  async sendResetPasswordEmail(
    username: string,
    email: string,
    resetCode: string,
  ) {
    await this.mailQueue.add('sendResetPasswordEmail', {
      username,
      email,
      resetCode,
    });
  }
}
