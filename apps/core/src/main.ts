import { NestFactory } from '@nestjs/core';
import { AppModule } from './routes/main/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    snapshot: true,
  });
  await app.get(AppModule).setApp(app);
}
bootstrap();
