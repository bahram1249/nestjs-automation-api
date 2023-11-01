import { NestFactory } from '@nestjs/core';
import { AppModule } from './routes/main/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './util/core/filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EmojiLogger } from './util/core/logger/emoji-logger.logger';
import { DBLogger } from './util/core/logger/db-logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  await app.get(AppModule).setApp(app);
}
bootstrap();
