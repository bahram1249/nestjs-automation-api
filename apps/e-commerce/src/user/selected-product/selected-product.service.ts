import { Injectable, NotFoundException } from '@nestjs/common';
import { GetSelectedProductDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import {
  ECSelectedProduct,
  ECSelectedProductType,
} from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';

@Injectable()
export class SelectedProductService {
  constructor(
    @InjectModel(ECSelectedProduct)
    private readonly repository: typeof ECSelectedProduct,
  ) {}

  async findAll(filter: GetSelectedProductDto) {
    const queryBuilder = new QueryOptionsBuilder().filter({
      title: {
        [Op.like]: filter.search,
      },
    });
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes([
        'id',
        'title',
        'slug',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'priority',
        'selectedProductTypeId',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'title'],
          model: ECSelectedProductType,
          as: 'selectedProductType',
          required: false,
        },
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
      ])
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECSelectedProduct.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }

  async findBySlug(slug: string) {
    const selectedProduct = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'title',
          'slug',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'description',
          'priority',
          'selectedProductTypeId',
          'createdAt',
          'updatedAt',
        ])
        .include([
          {
            attributes: ['id', 'title'],
            model: ECSelectedProductType,
            as: 'selectedProductType',
            required: false,
          },
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECSelectedProduct.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ slug: slug })
        .build(),
    );
    if (!selectedProduct) {
      throw new NotFoundException('the item with this given slug not founded!');
    }
    return {
      result: selectedProduct,
    };
  }
}
