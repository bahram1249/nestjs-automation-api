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
import { NeighborhoodService } from './neighborhood.service';
import { GetNeighborhoodDto } from './dto';
import { OptionalJwtGuard } from '@rahino/auth';
import { OptionalSessionGuard } from '../../user/session/guard';

@ApiTags('Neighborhoods')
@Controller({
  path: '/api/ecommerce/neighborhoods',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class NeighborhoodController {
  constructor(private service: NeighborhoodService) {}

  // public url
  @UseGuards(OptionalJwtGuard, OptionalSessionGuard)
  @ApiOperation({ description: 'show all neighborhoods' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetNeighborhoodDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetNeighborhoodDto) {
    return await this.service.findAll(filter);
  }
}
