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
import { ProvinceService } from './province.service';
import { OptionalJwtGuard } from '@rahino/auth';
import { OptionalSessionGuard } from '../../user/session/guard';

@ApiTags('Provinces')
@Controller({
  path: '/api/ecommerce/provinces',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ProvinceController {
  constructor(private service: ProvinceService) {}

  // public url
  @UseGuards(OptionalJwtGuard, OptionalSessionGuard)
  @ApiOperation({ description: 'show all provinces' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}
