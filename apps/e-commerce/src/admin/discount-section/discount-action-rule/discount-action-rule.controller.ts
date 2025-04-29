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
import { DiscountActionRuleService } from './discount-action-rule.service';
import { JwtGuard } from '@rahino/auth';

@ApiTags('Admin-DiscountActionRules')
@ApiBearerAuth()
@UseGuards(JwtGuard)
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
