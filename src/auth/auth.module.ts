import { Inject, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { StudentModule } from 'src/student/student.module';
import { AuthService } from './services/auth.service';
import { CacheModule } from 'src/cache/cache.module';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './services/token.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { JwtStrategy } from './strategies/jwt-access.strategie';

// ACCESS TOKEN PROVIDER
const AccessTokenJwtProvider = {
  provide: 'ACCESS_JWT_SERVICE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new JwtService({
      secret: configService.get<string>('jwt.accessSecret'),
      signOptions: {
        expiresIn: configService.get<string>('jwt.accessExpiresIn'),
      },
    });
  },
};

const RefreshTokenJwtProvider = {
  provide: 'REFRESH_JWT_SERVICE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new JwtService({
      secret: configService.get<string>('jwt.refreshSecret'),
      signOptions: {
        expiresIn: configService.get<string>('jwt.refreshExpiresIn'),
      },
    });
  },
};

@Module({
  imports: [ConfigModule, StudentModule, CacheModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AccessTokenJwtProvider,
    RefreshTokenJwtProvider,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
