import { Inject, Injectable, Scope } from '@nestjs/common';
import { GetProductDto, GetProductLatLonDto, GetUnPriceDto } from './dto';
import * as _ from 'lodash';
import { ProductRepositoryService } from './service/product-repository.service';
import {
  PRODUCT_VIEW_JOB,
  PRODUCT_VIEW_QUEUE,
  QUERY_NEXT_PAGE_PRODUCT_JOB,
  QUERY_NEXT_PAGE_PRODUCT_QUEUE,
  QUERY_NEXT_PAGE_PRODUCT_WITH_LAT_LON_QUEUE,
} from './constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  constructor(
    private readonly productRepositoryService: ProductRepositoryService,
    @InjectQueue(QUERY_NEXT_PAGE_PRODUCT_QUEUE)
    private nextPageQueryQueue: Queue,
    @InjectQueue(QUERY_NEXT_PAGE_PRODUCT_WITH_LAT_LON_QUEUE)
    private nextPageQueryWithLatLonQueue: Queue,
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectQueue(PRODUCT_VIEW_QUEUE)
    private readonly productViewQueue: Queue,
  ) {}

  async findBySlug(filter: GetProductDto, slug: string) {
    const product = await this.productRepositoryService.findBySlug(
      filter,
      slug,
    );
    this.productViewQueue.add(
      PRODUCT_VIEW_JOB,
      {
        productId: product.result.id,
        sessionId: this.request.ecsession?.id,
        userId: this.request.user ? this.request.user['id'] : null,
      },
      {
        removeOnComplete: 500,
      },
    );
    return {
      result: product,
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

  async findAllByVendorNearby(filter: GetProductLatLonDto) {
    const { result, total } =
      await this.productRepositoryService.findAllWithLatLon(filter);

    // todo
    this.nextPageQueryWithLatLonQueue.add(
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

  async priceRange(filter: GetUnPriceDto) {
    const { result } = await this.productRepositoryService.priceRange(filter);
    return {
      result: result,
    };
  }
}
