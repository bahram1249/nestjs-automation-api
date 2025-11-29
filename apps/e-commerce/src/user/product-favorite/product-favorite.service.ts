import { Injectable } from '@nestjs/common';
import { ProductFavoriteDto, GetProductFavoriteDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { ECProductFavorite } from '@rahino/localdatabase/models';
import { ProductRepositoryService } from '@rahino/ecommerce/client/product/service/product-repository.service';
import { ListFilterV2Factory } from '@rahino/query-filter/provider/list-filter-v2.factory';

@Injectable()
export class ProductFavoriteService {
  constructor(
    @InjectModel(ECProductFavorite)
    private readonly repository: typeof ECProductFavorite,
    private readonly productRepositoryService: ProductRepositoryService,
    private readonly i18n: I18nService<I18nTranslations>,
    private listFilterFactory: ListFilterV2Factory,
  ) {}

  async findAll(user: User, filter: GetProductFavoriteDto) {
    const queryBuilder = new QueryOptionsBuilder().filter({
      userId: user.id,
    });
    const count = await this.repository.count(queryBuilder.build());

    const favorites = await this.repository.findAll(queryBuilder.build());
    for (let index = 0; index < favorites.length; index++) {
      const favorite = favorites[index];
      favorite.set(
        'product',
        await this.productRepositoryService.findById(
          await this.listFilterFactory.create(),
          favorite.productId,
        ),
      );
      favorites[index] = favorite;
    }

    return {
      result: favorites,
      total: count,
    };
  }

  async statusByProductId(user: User, entityId: bigint) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          userId: user.id,
        })
        .filter({ productId: entityId })
        .build(),
    );
    const result = item ? true : false;

    return {
      result: result,
    };
  }

  async create(user: User, dto: ProductFavoriteDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          userId: user.id,
        })
        .filter({ productId: dto.productId })
        .build(),
    );
    if (!item) {
      await this.repository.create({
        userId: user.id,
        productId: dto.productId,
      });
    }

    return {
      result: 'ok',
    };
  }

  async deleteByProductId(user: User, entityId: bigint) {
    await this.repository.destroy({
      where: {
        userId: user.id,
        productId: entityId,
      },
    });

    return {
      result: 'ok',
    };
  }
}
