import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisRepositoryInterface, ExistsResultInterface } from '../interface';

@Injectable()
export class RedisRepository
  implements OnModuleDestroy, RedisRepositoryInterface
{
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async get(prefix: string, key: string): Promise<string | null> {
    return this.redisClient.get(`${prefix}:${key}`);
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }

  async isExists(prefix: string, key: string): Promise<ExistsResultInterface> {
    const resultCount = await this.redisClient.exists(`${prefix}:${key}`);
    const exists = resultCount == 1;
    let result: any = null;
    if (exists) {
      result = await this.get(prefix, key);
    }
    return { result: result, exists: exists };
  }

  async hset(key: string, value: any, expirySeconds?: number) {
    const result = await this.redisClient.hset(key, value);
    if (expirySeconds) await this.redisClient.expire(key, expirySeconds, 'NX');
    return result;
  }

  async hget(key: string, field: string) {
    return await this.redisClient.hget(key, field);
  }

  async hexists(key: string, field: string) {
    return await this.redisClient.hexists(key, field);
  }

  async hgetall(key: string) {
    return await this.redisClient.hgetall(key);
  }

  async removeKeysByPattern(pattern: string) {
    // maybe block
    const keys = await this.redisClient.keys(pattern);
    const pipeline = this.redisClient.pipeline();
    keys.forEach(function (key) {
      pipeline.del(key);
    });
    return await pipeline.exec();
  }
}
