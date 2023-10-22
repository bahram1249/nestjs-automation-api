import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user/user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: '127.0.0.1',
      port: 6379,
    },
  });
  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
