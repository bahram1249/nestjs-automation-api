import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth';
import { ProductTypeService } from './product-type.service';
import { GetProductTypeDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-ClientProductTypes')
@Controller({
  path: '/api/guarantee/client/productTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ProductTypeController {
  constructor(private service: ProductTypeService) {}

  @ApiOperation({ description: 'show all product types' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetProductTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetProductTypeDto) {
    return await this.service.findAll(filter);
  }
}
