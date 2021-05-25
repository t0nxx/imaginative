import EmailTemplate from '@/assets/password-recovery-email';

import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

@Injectable()
export default class MailManager {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  public async sendRecoveryLink(
    email: string,
    name: string,
    recoveryLink: string,
  ) {
    const recoveryEmailTemplate = EmailTemplate.replace('{{name}}', name)
      .replace('{{recoveryLink}}', recoveryLink)
      .replace('{{year}}', new Date().getFullYear().toString());

    return sgMail.send({
      to: email,
      from: 'noreply@imaginativenews.com',
      subject: 'ImaginativeNews - Recovery Code',
      html: recoveryEmailTemplate,
    });
  }
}
