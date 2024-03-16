import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscountActionRuleService } from './discount-action-rule.service';

@ApiTags('Admin-DiscountActionRules')
@Controller({
  path: '/api/ecommerce/admin/discountActionRules',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class DiscountActionRuleController {
  constructor(private service: DiscountActionRuleService) {}

  // public url
  @ApiOperation({ description: 'show all discount Action rules' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}
