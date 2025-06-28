import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HomePageService } from './home.service';
import { ProcessHomeByLatLonDto } from './dto';

@ApiTags('Home')
@Controller({
  path: '/api/ecommerce/homes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class HomePageController {
  constructor(private service: HomePageService) {}

  // public url

  @ApiOperation({ description: 'show all home sections v2' })
  @Get('/byNearbyVendor')
  @HttpCode(HttpStatus.OK)
  async findByLatLon(@Query() query: ProcessHomeByLatLonDto) {
    return await this.service.findByLatLon(query);
  }

  @ApiOperation({ description: 'show all home sections' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}
