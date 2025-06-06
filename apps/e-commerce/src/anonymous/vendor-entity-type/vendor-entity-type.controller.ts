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
import { GetEntityTypeDto } from './dto';
import { VendorEntityTypeService } from './vendor-entity-type.service';

@UseInterceptors(JsonResponseTransformInterceptor)
@ApiTags('AnonymousEcommerce-VendorEntityTypes')
@Controller({
  path: '/api/ecommerce/anonymous/vendorEntityTypes',
  version: ['1'],
})
export class VendorEntityTypeController {
  constructor(private service: VendorEntityTypeService) {}

  @ApiOperation({ description: 'show all entitytypes from client side' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetEntityTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetEntityTypeDto) {
    return await this.service.findAll(filter);
  }
}
