import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NeighborhoodService } from './neighborhood.service';
import {
  GetNeighborhoodDto,
  GuaranteeClientNeighborhoodListResponseDto,
} from './dto';

@ApiTags('GS-Neighborhoods')
@Controller({
  path: '/api/guarantee/client/neighborhoods',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class NeighborhoodController {
  constructor(private service: NeighborhoodService) {}

  // public url
  @ApiOperation({ description: 'show all neighborhoods' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetNeighborhoodDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  @ApiJsonResponse({ type: GuaranteeClientNeighborhoodListResponseDto })
  async findAll(@Query() filter: GetNeighborhoodDto) {
    return await this.service.findAll(filter);
  }
}
