import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {CreateEmailResponse, Resend} from 'resend';
@Injectable()
export class ResendService {
  private readonly resendService: Resend;
  private from: string;
  constructor(private readonly configService: ConfigService) {
    this.from = this.configService.get<string>('mail.from');
    const apiKey = this.configService.get<string>('mail.apiKey');
    if (!apiKey) {
      throw new Error('Missing API_KEY for Resend Service');
    }
    this.resendService = new Resend(apiKey);
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<CreateEmailResponse> {
    return await this.resendService.emails.send({
      from: this.from,
      to,
      subject,
      html,
    });
  }
}
