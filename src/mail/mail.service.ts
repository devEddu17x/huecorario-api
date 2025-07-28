import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEmailResponse, ResendService } from 'nestjs-resend';

@Injectable()
export class MailService {
  private from: string;
  constructor(
    private readonly resendService: ResendService,
    private readonly configService: ConfigService,
  ) {
    this.from = configService.get<string>('mail.from');
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<CreateEmailResponse> {
    return await this.resendService.send({
      from: this.from,
      to,
      subject,
      html,
    });
  }
}
