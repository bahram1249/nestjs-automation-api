import { NestFactory } from '@nestjs/core';
import { AppModule } from './routes/main/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './util/core/filter/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EmojiLogger } from './util/core/logger/emoji-logger.logger';
import { DBLogger } from './util/core/logger/db-logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const logger = new DBLogger();
  app.useLogger(logger);

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.REDIS,
  //   options: {
  //     host: '127.0.0.1',
  //     port: 6379,
  //   },
  // });
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nestjs Api')
    .setDescription('The Core API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Admin-PermissionGroups')
    .addTag('Admin-Permissions')
    .addTag('Admin-Role')
    .addTag('Admin-Menu')
    .addTag('Admin-Users')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(5000);
  await app.get(AppModule).setApp(app);
}
bootstrap();
