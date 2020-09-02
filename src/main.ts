import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { env } from './env';
import settings from './common/settings';
import { createFolderIfNotExists } from './common/utils';
import express from 'express';
import WebServer from './webServer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(env.NEST_PORT);
}

function createAppFolders() {
  Object.values(settings.all).forEach(createFolderIfNotExists);
}

new WebServer().listen();
createAppFolders();
bootstrap();
