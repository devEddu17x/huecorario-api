import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as config from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { ProgramModule } from './program/program.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from './cache/cache.module';
import { CourseModule } from './course/course.module';
// import { TeacherModule } from './teacher/teacher.module';
// import { ScheduleModule } from './schedule/schedule.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env'],
      load: [
        config.authConfig,
        config.databaseConfig,
        config.apiConfig,
        config.mailConfig,
        config.cacheConfig,
        config.bcryptConfig,
        config.jwtConfig,
        config.appConfig,
      ],
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
    CourseModule,
    // TeacherModule,
    // ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
