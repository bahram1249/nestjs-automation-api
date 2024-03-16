import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscountActionTypeService } from './discount-action-type.service';

@ApiTags('Admin-DiscountActionTypes')
@Controller({
  path: '/api/ecommerce/admin/discountActionTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class DiscountActionTypeController {
  constructor(private service: DiscountActionTypeService) {}

  // public url
  @ApiOperation({ description: 'show all discount Action types' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}
