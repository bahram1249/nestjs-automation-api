import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ShippingWayService } from './shipping-way.service';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('GS-Client-ShippingWays')
@Controller({
  path: '/api/guarantee/client/shippingWays',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ShippingWayController {
  constructor(private service: ShippingWayService) {}

  @ApiOperation({ description: 'show all shippingWay' })
  @Get('/request/:requestId')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('requestId') requestId: bigint,
    @Query() filter: ListFilter,
  ) {
    return await this.service.findAll(requestId, filter);
  }
}
