import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SYNC_SELLER_QUEUE } from './constants';

@Injectable()
export class SellerSyncService {
  constructor(
    @InjectQueue(SYNC_SELLER_QUEUE)
    private readonly syncSellerQueue: Queue,
  ) {}

  async sync() {
    await this.syncSellerQueue.add(
      'sync-seller',
      {},
      {
        repeat: {
          pattern: '*/2 * * * *',
        },
      },
    );
  }
}
