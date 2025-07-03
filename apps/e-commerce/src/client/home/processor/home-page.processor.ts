import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { HOME_PAGE_QUEUE } from '../constants';
import { ProcessHomeService } from '../process-home.service';
import { RedisRepository } from '@rahino/redis-client';

@Processor(HOME_PAGE_QUEUE)
export class HomePageProcessor extends WorkerHost {
  constructor(
    private readonly service: ProcessHomeService,
    private readonly redisRepository: RedisRepository,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      await this.redisRepository.removeKeysByPattern('home:*');
      const items = await this.service.processAll();
      await this.redisRepository.set('home', 'items', JSON.stringify(items));
    } catch {
      return Promise.reject(true);
    }
    return Promise.resolve(true);
  }
}
