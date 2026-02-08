import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Scope,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OptionalJwtGuard } from '@rahino/auth';
import {
  GetProductDto,
  GetProductLatLonDto,
  GetUnPriceDto,
  ProductResponseDto,
  BrandResponseDto,
  PublishStatusResponseDto,
  InventoryStatusResponseDto,
  EntityTypeResponseDto,
  InventoryResponseDto,
  ColorResponseDto,
  GuaranteeResponseDto,
  GuaranteeMonthResponseDto,
  ProvinceResponseDto,
  VendorResponseDto,
  ScheduleSendingTypeResponseDto,
  VariationPriceResponseDto,
  InventoryPriceResponseDto,
  AttachmentResponseDto,
  PriceRangeResponseDto,
} from './dto';
import { ProductService } from './product.service';
import { OptionalSessionGuard } from '../../user/session/guard';
import { ApiJsonResponse } from '@rahino/response';

@ApiTags('Products')
@UseGuards(OptionalJwtGuard, OptionalSessionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/products',
  version: ['1'],
  scope: Scope.REQUEST,
})
export class ProductController {
  constructor(private service: ProductService) {}

  // public url

  @ApiOperation({ description: 'show all products by vendor nearby' })
  @ApiJsonResponse({
    type: ProductResponseDto,
    isArray: true,
    extraModels: [
      BrandResponseDto,
      PublishStatusResponseDto,
      InventoryStatusResponseDto,
      EntityTypeResponseDto,
      InventoryResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      ProvinceResponseDto,
      VendorResponseDto,
      ScheduleSendingTypeResponseDto,
      VariationPriceResponseDto,
      InventoryPriceResponseDto,
      AttachmentResponseDto,
    ],
  })
  @Get('/byVendorNearby')
  @ApiQuery({
    name: 'filter',
    type: GetProductDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findByVendorNearby(
    @Query(new ValidationPipe({ transform: true })) filter: GetProductLatLonDto,
  ) {
    return await this.service.findAllByVendorNearby(filter);
  }

  @ApiOperation({ description: 'show all products' })
  @ApiJsonResponse({
    type: ProductResponseDto,
    isArray: true,
    extraModels: [
      BrandResponseDto,
      PublishStatusResponseDto,
      InventoryStatusResponseDto,
      EntityTypeResponseDto,
      InventoryResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      ProvinceResponseDto,
      VendorResponseDto,
      ScheduleSendingTypeResponseDto,
      VariationPriceResponseDto,
      InventoryPriceResponseDto,
      AttachmentResponseDto,
    ],
  })
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

  @ApiOperation({ description: 'get price range of products' })
  @ApiJsonResponse({ type: PriceRangeResponseDto })
  @Get('/priceRange')
  @ApiQuery({
    name: 'filter',
    type: GetUnPriceDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async priceRange(
    @Query(new ValidationPipe({ transform: true })) filter: GetUnPriceDto,
  ) {
    return await this.service.priceRange(filter);
  }

  @ApiOperation({ description: 'show product by given slug' })
  @ApiJsonResponse({
    type: ProductResponseDto,
    extraModels: [
      BrandResponseDto,
      PublishStatusResponseDto,
      InventoryStatusResponseDto,
      EntityTypeResponseDto,
      InventoryResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      ProvinceResponseDto,
      VendorResponseDto,
      ScheduleSendingTypeResponseDto,
      VariationPriceResponseDto,
      InventoryPriceResponseDto,
      AttachmentResponseDto,
    ],
  })
  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(
    @Query(new ValidationPipe({ transform: true })) filter: GetProductDto,
    @Param('slug') slug: string,
  ) {
    return await this.service.findBySlug(filter, slug);
  }

  @ApiOperation({ description: 'show product by given id' })
  @ApiJsonResponse({
    type: ProductResponseDto,
    extraModels: [
      BrandResponseDto,
      PublishStatusResponseDto,
      InventoryStatusResponseDto,
      EntityTypeResponseDto,
      InventoryResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      ProvinceResponseDto,
      VendorResponseDto,
      ScheduleSendingTypeResponseDto,
      VariationPriceResponseDto,
      InventoryPriceResponseDto,
      AttachmentResponseDto,
    ],
  })
  @Get('/id/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Query(new ValidationPipe({ transform: true })) filter: GetProductDto,
    @Param('id') id: bigint,
  ) {
    return await this.service.findById(filter, id);
  }
}
