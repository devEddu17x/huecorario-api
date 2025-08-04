import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
@Injectable()
export class SignatureService {
  private secret: string;
  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get<string>('signature.secret');
    if (!this.secret) {
      throw new Error('Signature secret is not defined in the configuration');
    }
  }

  generateSignedURL(baseURL: string, expiresInSeconds: number): string {
    const url = new URL(baseURL);
    const timestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(`${url.pathname}|${timestamp}`)
      .digest('hex');
    console.log('pathname', url.pathname);

    return `${baseURL}?expires=${timestamp}&signature=${signature}`;
  }
}
