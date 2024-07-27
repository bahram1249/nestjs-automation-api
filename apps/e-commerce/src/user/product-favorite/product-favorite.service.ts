import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductFavoriteDto, GetProductFavoriteDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECCity } from '@rahino/database/models/ecommerce-eav/ec-city.entity';
import { ECNeighborhood } from '@rahino/database/models/ecommerce-eav/ec-neighborhood.entity';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ECProductFavorite } from '@rahino/database/models/ecommerce-eav/ec-product-favorite';
import { ProductRepositoryService } from '@rahino/ecommerce/product/service/product-repository.service';

@Injectable()
export class ProductFavoriteService {
  constructor(
    @InjectModel(ECProductFavorite)
    private repository: typeof ECProductFavorite,
    private productRepositoryService: ProductRepositoryService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async findAll(user: User, filter: GetProductFavoriteDto) {
    const queryBuilder = new QueryOptionsBuilder().filter({
      userId: user.id,
    });
    const count = await this.repository.count(queryBuilder.build());

    let products = await this.repository.findAll(queryBuilder.build());
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      product.set(
        'product',
        await this.productRepositoryService.findById({}, product.id),
      );
      products[index] = product;
    }

    return {
      result: products,
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
