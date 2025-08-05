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
  app.enableCors({
    origin: configService.get<string[]>('api.origin'),
    methods: 'GET,PUT,PATCH,POST',
    credentials: true,
  });

  console.log(
    `CORS enabled for origins: ${configService.get<string[]>('api.origin')}`,
  );
  await app.listen(configService.get<number>('api.port'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
