import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscountTypeService } from './discount-type.service';
import { JwtGuard } from '@rahino/auth';

@ApiTags('Admin-DiscountTypes')
@ApiBearerAuth()
@UseGuards(JwtGuard)
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
