import {Module} from '@nestjs/common';
import {MailService} from './mail.service';
import {ResendModule} from 'nestjs-resend';
import {ConfigModule, ConfigService} from '@nestjs/config';
@Module({
  imports: [
    ResendModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('resend.apiKey'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
