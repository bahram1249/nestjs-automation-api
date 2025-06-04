import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ShippingWayService } from './shipping-way.service';
import { OptionalJwtGuard } from '@rahino/auth';
import { OptionalSessionGuard } from '@rahino/ecommerce/user/session/guard';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('AnonymousShippingWays')
@Controller({
  path: '/api/ecommerce/anonymous/shippingWays',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ShippingWayController {
  constructor(private service: ShippingWayService) {}

  // public url
  @UseGuards(OptionalJwtGuard, OptionalSessionGuard)
  @ApiOperation({ description: 'show all shipping ways' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }
}
