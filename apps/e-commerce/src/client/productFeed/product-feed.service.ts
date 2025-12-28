import { Injectable, Scope } from '@nestjs/common';
import { ProductFeedFilter } from './dto';
import * as _ from 'lodash';
import { ProductRepositoryService } from '../product/service/product-repository.service';
import { ListFilterV2Factory } from '@rahino/query-filter/provider/list-filter-v2.factory';
import { GetProductDto } from '../product/dto/get-product.dto';
import { ProductFeedFormatterService } from './product-feed-formatter.service';

@Injectable({ scope: Scope.REQUEST })
export class ProductFeedService {
  constructor(
    private readonly productRepositoryService: ProductRepositoryService,
    private readonly listFilterFactory: ListFilterV2Factory,
    private readonly formatter: ProductFeedFormatterService,
  ) {}

  async findBySlug(filter: ProductFeedFilter, slug: string) {
    const listFilter = await this.listFilterFactory.create();
    listFilter.limit = filter.size;
    listFilter.offset = ((filter.page || 1) - 1) * filter.size;
    const filterDto = listFilter as GetProductDto;
    const product = await this.productRepositoryService.findBySlug(
      filterDto,
      slug,
    );

    return this.formatter.singleFormatter(product.result);
  }

  async findById(filter: ProductFeedFilter, productId: bigint) {
    const listFilter = await this.listFilterFactory.create();
    listFilter.limit = filter.size;
    listFilter.offset = ((filter.page || 1) - 1) * filter.size;
    const filterDto = listFilter as GetProductDto;
    const product = await this.productRepositoryService.findById(
      filterDto,
      productId,
    );
    return this.formatter.singleFormatter(product.result);
  }

  async findAll(filter: ProductFeedFilter) {
    const listFilter = await this.listFilterFactory.create();
    listFilter.limit = filter.size;
    listFilter.offset = ((filter.page || 1) - 1) * filter.size;
    const filterDto = listFilter as GetProductDto;

    const { result, total } =
      await this.productRepositoryService.findAll(filterDto);

    return this.formatter.listFormatter(result);
  }
}
