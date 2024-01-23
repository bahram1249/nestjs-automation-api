import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CityService } from './city.service';
import { GetCityDto } from './dto';

@ApiTags('Cities')
@Controller({
  path: '/api/ecommerce/cities',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class CityController {
  constructor(private service: CityService) {}

  // public url
  @ApiOperation({ description: 'show all cities' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetCityDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetCityDto) {
    return await this.service.findAll(filter);
  }
}
