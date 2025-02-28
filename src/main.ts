import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './environments/environment';
import { ValidationPipe } from '@nestjs/common';

const httpsOptions = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.pub'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors(environment.cors);

  await app.listen(3000);
}
bootstrap();
