import { Injectable } from '@nestjs/common';
import { ProductRepositoryService } from '../../client/product/service/product-repository.service';
import { ListFilterV2Factory } from '@rahino/query-filter/provider/list-filter-v2.factory';
import { TorobProductFormatterService } from './torob-product-formatter.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TorobProductService {
  private readonly limit: number = 100;
  constructor(
    private readonly productRepositoryService: ProductRepositoryService,
    private readonly listFilterFactory: ListFilterV2Factory,
    private readonly torobProductFormatter: TorobProductFormatterService,
    private readonly config: ConfigService,
  ) {}
  async findAll(page: number) {
    const listFilter = await this.listFilterFactory.create();
    listFilter.limit = this.limit;
    listFilter.offset = this.limit * (page - 1);
    const { result, total } =
      await this.productRepositoryService.findAll(listFilter);
    const formattedProducts =
      await this.torobProductFormatter.listFormatter(result);

    let nextpage;
    let previewpage;
    const baseUrl = this.config.get('BASE_URL');
    if (listFilter.limit + listFilter.offset < total) {
      nextpage = `${baseUrl}/v1/api/ecommerce/torob/products/page/${page + 1}`;
    }

    if (listFilter.limit + listFilter.offset > this.limit) {
      previewpage = `${baseUrl}/v1/api/ecommerce/torob/products/page/${
        page - 1
      }`;
    }

    return {
      result: {
        products: formattedProducts,
        nextpage: nextpage,
        previewpage: previewpage,
      },
      total: total,
    };
  }
}
