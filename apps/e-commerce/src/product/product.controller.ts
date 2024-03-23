import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OptionalJwtGuard } from '@rahino/auth/guard';
import { GetProductDto } from './dto';
import { ProductService } from './product.service';
import { OptionalSessionGuard } from '../user/session/guard';

@ApiTags('Products')
@UseGuards(OptionalJwtGuard, OptionalSessionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/products',
  version: ['1'],
})
export class ProductController {
  constructor(private service: ProductService) {}

  // public url

  @ApiOperation({ description: 'show all products' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetProductDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query(new ValidationPipe({ transform: true })) filter: GetProductDto,
  ) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show product by given slug' })
  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(
    @Query(new ValidationPipe({ transform: true })) filter: GetProductDto,
    @Param('slug') slug: string,
  ) {
    return await this.service.findBySlug(filter, slug);
  }

  @ApiOperation({ description: 'show product by given slug' })
  @Get('/id/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Query(new ValidationPipe({ transform: true })) filter: GetProductDto,
    @Param('id') id: bigint,
  ) {
    return await this.service.findById(filter, id);
  }
}
