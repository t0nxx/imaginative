import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('mails')
export class MailProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process('sendResetPasswordEmail')
  async sendResetPasswordEmail(
    job: Job<{ username: string; email: string; resetCode: string }>,
  ) {
    const link = 'logic to do here';
    try {
      await this.mailerService.sendMail({
        template: 'resetPassword',
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
