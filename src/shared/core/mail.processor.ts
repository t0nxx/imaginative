import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import FireBaseService from './FireBase.service';
import { Job } from 'bull';

@Processor('mails')
export class MailProcessor {
  constructor(
    private readonly mailerService: MailerService,
    private readonly fireBaseService: FireBaseService,
  ) {}

  @Process('sendResetPasswordEmail')
  async sendResetPasswordEmail(
    job: Job<{ username: string; email: string; resetCode: string }>,
  ) {
    const link = await this.fireBaseService.getFirebaseDynamicLink(
      'forgot-password',
      { email: job.data.email, token: job.data.resetCode },
    );
    try {
      await this.mailerService.sendMail({
        template: './forgotPassword',
        context: {
          username: job.data.username,
          link,
        },
        subject: 'ImaginativeNews - Reset Password Code',
        to: job.data.email,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
