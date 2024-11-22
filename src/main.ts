import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors(configService.get('cors'));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://develop-time-tracking-ute.vercel.app/',
      'https://time-tracking-ute.vercel.app/',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, authorization',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe()); // Initialize global validation
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });
  await app.listen(3030);
}
bootstrap();
