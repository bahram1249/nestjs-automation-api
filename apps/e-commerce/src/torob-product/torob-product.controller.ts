import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TorobProductService } from './torob-product.service';

@ApiTags('TorobProducts')
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/torob/products',
  version: ['1'],
})
export class TorobProductController {
  constructor(private service: TorobProductService) {}

  // public url

  @ApiOperation({ description: 'show all products' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const page = 1;
    return await this.service.findAll(page);
  }

  @ApiOperation({ description: 'show all products by page' })
  @Get('/page/:page')
  @HttpCode(HttpStatus.OK)
  async findAllByPaging(@Param('page') page: number) {
    return await this.service.findAll(page);
  }
}
