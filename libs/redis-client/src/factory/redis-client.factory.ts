import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: (config: ConfigService) => {
    const redisAddress = config.get<string>('REDIS_ADDRESS');
    const redisPort = config.get<number>('REDIS_PORT');
    const redisPassword = config.get<string>('REDIS_PASSWORD');

    const redisInstance = new Redis({
      host: redisAddress,
      port: redisPort,
      password: redisPassword,
    });

    // redisInstance.on('error', (e) => {
    //   throw new Error(`Redis connection failed: ${e}`);
    // });

    return redisInstance;
  },
  inject: [ConfigService],
};
