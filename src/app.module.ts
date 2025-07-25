import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import apiConfig from './config/api.config';
import {MongooseModule} from '@nestjs/mongoose';
import {StudentModule} from './student/student.module';
import {ProgramService} from './program/program.service';
import {ProgramModule} from './program/program.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env'],
      load: [authConfig, databaseConfig, apiConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        dbName: configService.get<string>('database.dbName'),
      }),
      inject: [ConfigService],
    }),
    StudentModule,
    ProgramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
