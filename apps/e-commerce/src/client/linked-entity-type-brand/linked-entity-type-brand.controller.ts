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
import { LinkedEntityTypeBrandService } from './linked-entity-type-brand.service';
import {
  GetLinkedEntityTypeBrandDto,
  LinkedEntityTypeBrandResponseDto,
} from './dto';

@UseInterceptors(JsonResponseTransformInterceptor)
@ApiTags('Client-LinkedEntityTypeBrands')
@Controller({
  path: '/api/ecommerce/client/linkedEntityTypeBrands',
  version: ['1'],
})
export class LinkedEntityTypeBrandController {
  constructor(private service: LinkedEntityTypeBrandService) {}

  @ApiQuery({
    name: 'filter',
    type: GetLinkedEntityTypeBrandDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiOperation({ description: 'show linked entity type brand slug filter' })
  @ApiJsonResponse({ type: LinkedEntityTypeBrandResponseDto })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findById(@Query() filter: GetLinkedEntityTypeBrandDto) {
    return await this.service.findById(filter);
  }
}
