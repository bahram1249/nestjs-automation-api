import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  SYNC_SELLER_BRAND_QUEUE,
  SYNC_SELLER_PRODUCT_TYPE_QUEUE,
  SYNC_SELLER_QUEUE,
  SYNC_SELLER_VARIANT_QUEUE,
  SYNC_SELLER_WARRANTY_QUEUE,
} from './constants';

@Injectable()
export class SellerSyncService {
  constructor(
    @InjectQueue(SYNC_SELLER_QUEUE)
    private readonly syncSellerQueue: Queue,
    @InjectQueue(SYNC_SELLER_BRAND_QUEUE)
    private readonly syncSellerBrandQueue: Queue,
    @InjectQueue(SYNC_SELLER_PRODUCT_TYPE_QUEUE)
    private readonly syncSellerProductTypeQueue: Queue,
    @InjectQueue(SYNC_SELLER_VARIANT_QUEUE)
    private readonly syncSellerVariantQueue: Queue,
    @InjectQueue(SYNC_SELLER_WARRANTY_QUEUE)
    private readonly syncSellerWarrantyQueue: Queue,
  ) {}

  async sync() {
    await this.syncSellerBrandQueue.add(
      'sync-seller-brand',
      {},
      {
        repeat: {
          pattern: '*/5 * * * *',
          // count: 1,
          // limit: 1,
        },
        attempts: 1,
        jobId: 'sync-seller-brand',
      },
    );

    // console.log('sync called brand');

    await this.syncSellerProductTypeQueue.add(
      'sync-seller-product-type',
      {},
      {
        repeat: {
          pattern: '*/5 * * * *',
          // count: 1,
          // limit: 1,
        },
        attempts: 1,
        jobId: 'sync-seller-product-type',
      },
    );

    await this.syncSellerVariantQueue.add(
      'sync-seller-variant',
      {},
      {
        repeat: {
          pattern: '*/5 * * * *',
          // count: 1,
          // limit: 1,
        },
        attempts: 1,
        jobId: 'sync-seller-variant',
      },
    );
    await this.syncSellerWarrantyQueue.add(
      'sync-seller-warranty',
      {},
      {
        repeat: {
          pattern: '*/5 * * * *',
          //count: 1,
          //limit: 1,
        },
        attempts: 1,
        jobId: 'sync-seller-warranty',
      },
    );

    // await this.syncSellerQueue.add(
    //   'sync-seller',
    //   {},
    //   {
    //     repeat: {
    //       pattern: '*/5 * * * *',
    //       // count: 1,
    //       // limit: 1,
    //     },
    //     attempts: 1,
    //     jobId: 'sync-seller',
    //   },
    // );
  }
}
