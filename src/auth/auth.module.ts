import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { StudentModule } from 'src/student/student.module';
import { AuthService } from './auth.service';
import { CacheModule } from 'src/cache/cache.module';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, StudentModule, CacheModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
