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
import { DiscountConditionTypeService } from './discount-condition-type.service';
import { JwtGuard } from '@rahino/auth';
import { ApiJsonResponse } from '@rahino/response';
import { DiscountConditionTypeResponseDto } from './dto';

@ApiTags('Admin-DiscountConditionTypes')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({
  path: '/api/ecommerce/admin/discountConditionTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class DiscountConditionTypeController {
  constructor(private service: DiscountConditionTypeService) {}

  // public url
  @ApiOperation({ description: 'show all discount Condition Types' })
  @ApiJsonResponse({ type: DiscountConditionTypeResponseDto, isArray: true })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}
