import { Module } from '@nestjs/common';
import { redisClientFactory } from './factory';
import { RedisRepository } from './repository';

@Module({
  providers: [redisClientFactory, RedisRepository],
  exports: [RedisRepository],
})
export class RedisClientModule {}
