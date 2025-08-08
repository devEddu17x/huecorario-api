import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('combined'));
  const securityLogger = new Logger('Security');
  app.use((req: Request, res: Response, next: NextFunction) => {
    const suspiciousPaths = [
      /\/\.[^/]+/, // archivos ocultos (.env, .git, etc)
      /\/(admin|wp-admin)/i, // rutas de admin
      /\/aws/i, // rutas AWS
      /\/docker/i, // rutas Docker
      /\/\.well-known/, // except for legitimate use
      /\/config/i, // archivos de configuración
      /\/backup/i, // backups
      /\/secret/i, // secretos
      /\/api\/v[0-9]/, // versiones de API no existentes
    ];

    if (suspiciousPaths.some((pattern) => pattern.test(req.path))) {
      // Log del intento sospechoso
      securityLogger.warn(
        `Blocked: ${req.ip} -> ${req.method} ${req.path} [${req.get('User-Agent') || 'Unknown'}]`,
      );
      return res.status(401).json({ message: 'Nice try but no :*' });
    }

    next();
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(/^\/\.[^/]+/, (req, res) => res.sendStatus(401));
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string[]>('api.origin'),
    methods: 'GET,PUT,PATCH,POST',
    credentials: true,
  });

  console.log(
    `CORS enabled for origins: ${configService.get<string[]>('api.origin')}`,
  );
  await app.listen(configService.get<number>('api.port'), '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
