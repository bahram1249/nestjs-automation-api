import { Injectable } from '@nestjs/common';
import { GetProductDto } from './dto';
import * as _ from 'lodash';
import { ProductRepositoryService } from './service/product-repository.service';
import {
  QUERY_NEXT_PAGE_PRODUCT_JOB,
  QUERY_NEXT_PAGE_PRODUCT_QUEUE,
} from './constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepositoryService: ProductRepositoryService,
    @InjectQueue(QUERY_NEXT_PAGE_PRODUCT_QUEUE)
    private nextPageQueryQueue: Queue,
  ) {}

  async findBySlug(filter: GetProductDto, slug: string) {
    return {
      result: await this.productRepositoryService.findBySlug(filter, slug),
    };
  }

  async findById(filter: GetProductDto, productId: bigint) {
    return {
      result: await this.productRepositoryService.findById(filter, productId),
    };
  }

  async findAll(filter: GetProductDto) {
    const { result, total } =
      await this.productRepositoryService.findAll(filter);
    this.nextPageQueryQueue.add(
      QUERY_NEXT_PAGE_PRODUCT_JOB,
      {
        filter: filter,
      },
      {
        removeOnComplete: 500,
      },
    );
    return {
      result: result,
      total: total,
    };
  }
}
