import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscountTypeService } from './discount-type.service';

@ApiTags('Admin-DiscountTypes')
@Controller({
  path: '/api/ecommerce/admin/discountTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class DiscountTypeController {
  constructor(private service: DiscountTypeService) {}

  // public url
  @ApiOperation({ description: 'show all discount types' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}
