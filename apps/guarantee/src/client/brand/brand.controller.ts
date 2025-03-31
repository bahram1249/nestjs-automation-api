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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth';
import { BrandService } from './brand.service';
import { GetBrandDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-ClientBrands')
@Controller({
  path: '/api/guarantee/client/brands',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class BrandController {
  constructor(private service: BrandService) {}

  @ApiOperation({ description: 'show all brands' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetBrandDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetBrandDto) {
    return await this.service.findAll(filter);
  }
}
