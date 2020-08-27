import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static(join(process.cwd(), './client/dist/')));
  await app.listen(3000);
  console.log(
    'The server listens on port 3000. Use this link to launch the users-app: http://localhost:3000/',
  );
}
bootstrap();
