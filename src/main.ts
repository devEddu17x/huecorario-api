import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(morgan('dev'));
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('api.port', 3000));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
