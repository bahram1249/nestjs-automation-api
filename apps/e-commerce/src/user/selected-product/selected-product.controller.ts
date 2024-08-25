import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { SelectedProductService } from './selected-product.service';
import { GetSelectedProductDto } from './dto';
@ApiTags('User-SelectedProducts')
@Controller({
  path: '/api/ecommerce/user/selectedProducts',
  version: ['1'],
})
export class SelectedProductController {
  constructor(private service: SelectedProductService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show all selected products' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetSelectedProductDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetSelectedProductDto) {
    return await this.service.findAll(filter);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show selected products by given slug' })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }
}
