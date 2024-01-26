import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op, Sequelize } from 'sequelize';
import { GetProductDto, ProductDto } from './dto';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { EntityAttributeValueService } from '@rahino/eav/admin/entity-attribute-value/entity-attribute-value.service';
import { ProductAttributeDto } from './dto/product-attribute.dto';
import { EntityAttributeValueDto } from '@rahino/eav/admin/entity-attribute-value/dto';
import { EntityService } from '@rahino/eav/admin/entity/entity.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
    @InjectMapper() private readonly mapper: Mapper,
    private entityAttributeValueService: EntityAttributeValueService,
    private entityService: EntityService,
  ) {}

  async findAll(filter: GetProductDto) {
    let options = QueryFilter.init();
    const productCount = await this.repository.count();
    options = QueryFilter.toFindAndCountOptions(options, filter);
    options.attributes = ['id', 'name', 'createdAt', 'updatedAt'];
    const products = await this.repository.findAll(options);
    return {
      result: products, //await this.repository.findAll(options),
      total: productCount, //count,
    };
  }

  async findById(id: number) {
    throw new NotImplementedException();
  }

  async create(dto: ProductDto) {
    const slugSearch = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ slug: dto.slug })
        .build(),
    );
    if (slugSearch) {
      throw new BadRequestException(
        'the item with this given slug is exists before !',
      );
    }

    // validation of attributes

    const mappedAttribute = _.map(dto.attributes, (attribute) =>
      this.mapper.map(attribute, ProductAttributeDto, EntityAttributeValueDto),
    );

    await this.entityAttributeValueService.validation(
      dto.entityTypeId,
      mappedAttribute,
    );

    // map item
    const mappedItem = this.mapper.map(dto, ProductDto, ECProduct);
    const { result } = await this.entityService.create({
      entityTypeId: mappedItem.entityTypeId,
    });
    let insertItem = _.omit(mappedItem.toJSON(), ['id']);
    insertItem.id = result.entityId;
    const unavailable = 2;
    insertItem.inventoryStatusId = unavailable;
    const product = await this.repository.create(insertItem);

    // update inventory status

    return {
      result: product,
    };
  }

  async update(entityId: number, dto: ProductDto) {
    throw new NotImplementedException();
  }

  async deleteById(entityId: number) {
    let product = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          id: entityId,
        })
        .build(),
    );
    if (!product) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    product.isDeleted = true;
    product = await product.save();
    return {
      result: _.pick(product, [
        'id',
        'title',
        'description',
        'slug',
        'entityTypeId',
        'colorBased',
        'brandId',
        'publishStatusId',
      ]),
    };
  }
}
