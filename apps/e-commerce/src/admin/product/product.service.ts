import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op, Sequelize } from 'sequelize';
import { GetProductDto, ProductDto } from './dto';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
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
    throw new NotImplementedException();
  }

  async update(entityId: number, dto: ProductDto) {
    throw new NotImplementedException();
  }
}
