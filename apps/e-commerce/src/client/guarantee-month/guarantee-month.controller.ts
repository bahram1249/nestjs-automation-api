import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GuaranteeMonthService } from './guarantee-month.service';
import { OptionalJwtGuard } from '@rahino/auth';
import { OptionalSessionGuard } from '../../user/session/guard';

@ApiTags('GuaranteeMonths')
@Controller({
  path: '/api/ecommerce/guaranteeMonths',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class GuaranteeMonthController {
  constructor(private service: GuaranteeMonthService) {}

  // public url
  @UseGuards(OptionalJwtGuard, OptionalSessionGuard)
  @ApiOperation({ description: 'show all guarantee months' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}
