import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GuaranteeMonthService } from './guarantee-month.service';
import { GuaranteeMonthResponseDto } from './dto';
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
  @ApiJsonResponse({ type: GuaranteeMonthResponseDto, isArray: true })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}
