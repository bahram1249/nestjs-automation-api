import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GuaranteeMonthService } from './guarantee-month.service';

@ApiTags('GuaranteeMonths')
@Controller({
  path: '/api/ecommerce/guaranteeMonths',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class GuaranteeMonthController {
  constructor(private service: GuaranteeMonthService) {}

  // public url
  @ApiOperation({ description: 'show all guarantee months' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}
