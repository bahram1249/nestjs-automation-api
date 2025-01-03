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
import { PersianDateMonthService } from './persian-date-month.service';
import { JwtGuard } from '@rahino/auth';

@ApiTags('PersianDate-Month')
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/persiandate/month',
  version: ['1'],
})
@UseGuards(JwtGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
export class PersianDateMonthController {
  constructor(private service: PersianDateMonthService) {}

  // public url

  @ApiOperation({ description: 'show first day of months' })
  @Get('/firstDays')
  @HttpCode(HttpStatus.OK)
  async firstDays() {
    return await this.service.firstDays();
  }

  // public url
  @UseGuards(JwtGuard)
  @ApiOperation({ description: 'show last day of months' })
  @Get('/lastDays')
  @HttpCode(HttpStatus.OK)
  async lastDays() {
    return await this.service.lastDays();
  }
}
