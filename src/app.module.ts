import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import apiConfig from './config/api.config';
import mailConfig from './config/mail.config';
import cacheConfig from './config/cache.config';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { ProgramModule } from './program/program.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from './cache/cache.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env'],
      load: [authConfig, databaseConfig, apiConfig, mailConfig, cacheConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        dbName: configService.get<string>('database.dbName'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    StudentModule,
    ProgramModule,
    MailModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
