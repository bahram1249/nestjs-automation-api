import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Scope,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductFeedFilter } from './dto';
import { ProductFeedService } from './product-feed.service';

@ApiTags('ProductFeeds')
@Controller({
  path: '/api/ecommerce/client/productFeeds',
  version: ['1'],
  scope: Scope.REQUEST,
})
export class ProductFeedController {
  constructor(private service: ProductFeedService) {}

  // public url

  @ApiOperation({ description: 'show all products' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ProductFeedFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query(new ValidationPipe({ transform: true })) filter: ProductFeedFilter,
  ) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show product by given slug' })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(
    @Query(new ValidationPipe({ transform: true })) filter: ProductFeedFilter,
    @Param('slug') slug: string,
  ) {
    return await this.service.findBySlug(filter, slug);
  }

  @ApiOperation({ description: 'show product by given slug' })
  @Get('/id/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Query(new ValidationPipe({ transform: true })) filter: ProductFeedFilter,
    @Param('id') id: bigint,
  ) {
    return await this.service.findById(filter, id);
  }
}
