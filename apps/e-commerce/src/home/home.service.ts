import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { RedisRepository } from '@rahino/redis-client';

@Injectable()
export class HomePageService {
  constructor(private readonly redisRepository: RedisRepository) {}

  async findAll() {
    const items = JSON.parse(await this.redisRepository.get('home', 'items'));
    return {
      result: items,
    };
  }
}
