import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ResendService} from 'nestjs-resend';

@Injectable()
export class MailService {
  from: string;
  constructor(
    private readonly resendService: ResendService,
    private readonly configService: ConfigService,
  ) {
    this.from = configService.get<string>('mail.from');
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.resendService.send({
      from: this.from,
      to,
      subject,
      html,
    });
  }
}
