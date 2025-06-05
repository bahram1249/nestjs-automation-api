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
import { NearbyVendorService } from './nearby-vendor.service';
import { OptionalJwtGuard } from '@rahino/auth';
import { OptionalSessionGuard } from '@rahino/ecommerce/user/session/guard';
import { ListFilter } from '@rahino/query-filter';
import { GetNearbyVendorDto } from './dto';

@ApiTags('AnonymousNearbyVendors')
@Controller({
  path: '/api/ecommerce/anonymous/nearbyVendors',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class NearbyVendorController {
  constructor(private service: NearbyVendorService) {}

  // public url
  @UseGuards(OptionalJwtGuard, OptionalSessionGuard)
  @ApiOperation({ description: 'show all nearby vendors' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetNearbyVendorDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetNearbyVendorDto) {
    return await this.service.findAll(filter);
  }
}
