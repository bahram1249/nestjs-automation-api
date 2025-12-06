import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECProductView } from '@rahino/localdatabase/models/ecommerce-eav/ec-product-view.model';
import { User } from '@rahino/database';
import { GetRecentProductDto } from './dto/get-recent-product.dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ProductRepositoryService } from '../product/service/product-repository.service';
import { GetProductDto } from '../product/dto';
import { REQUEST } from '@nestjs/core';
import { Sequelize } from 'sequelize';

@Injectable()
export class ProductViewService {
  constructor(
    @Inject(REQUEST)
    private readonly request: { user?: User; ecsession?: { id: string } },
    @InjectModel(ECProductView)
    private readonly productViewRepository: typeof ECProductView,
    private readonly productRepositoryService: ProductRepositoryService,
  ) {}

  async getRecentProducts(user: User, filter: GetRecentProductDto) {
    let builder = new QueryOptionsBuilder();
    builder = builder
      .attributes([
        'productId',
        [
          Sequelize.fn('MAX', Sequelize.col('ECProductView.createdAt')),
          'lastSeenAt',
        ],
      ])
      .group(['ECProductView.productId'])
      .order([Sequelize.fn('MAX', Sequelize.col('createdAt')), 'DESC'])
      //.order({ sortOrder: 'DESC', orderBy: 'cnt' })

      .limit(filter.limit)
      .offset(filter.offset);

    if (user) {
      builder = builder.filter({
        userId: user.id,
      });
    } else if (this.request.ecsession && this.request.ecsession.id) {
      builder = builder.filter({
        sessionId: this.request.ecsession.id,
      });
    } else {
      return {
        result: [],
        total: 0,
      };
    }

    const queryOptions = builder.build();

    const productViews = await this.productViewRepository.findAll(queryOptions);
    console.log(productViews);
    const productIds = productViews.map((view) => Number(view.productId));

    if (productIds.length === 0) {
      return {
        result: [],
        total: 0,
      };
    }

    // Since GetRecentProductDto is an IntersectionType of ListFilter and SessionIdDto
    // and GetProductDto is also an IntersectionType that includes ListFilter and ProductIdsFilterDto,
    // we can safely cast filter to GetProductDto and add productIds.
    const productFilter: GetProductDto = filter as GetProductDto;
    productFilter.productIds = productIds;

    const { result, total } =
      await this.productRepositoryService.findAll(productFilter);

    // Reorder results based on productIds order from recent views
    const orderedResult = productIds
      .map((id) => result.find((p) => Number(p.id) === id))
      .filter(Boolean); // Filter out any undefined if a product ID was not found

    return {
      result: orderedResult,
      total: total,
    };
  }
}
