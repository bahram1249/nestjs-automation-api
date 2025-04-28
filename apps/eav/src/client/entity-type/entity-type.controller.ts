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
import { EntityTypeService } from './entity-type.service';

@UseInterceptors(JsonResponseTransformInterceptor)
@ApiTags('EAVClient-EntityTypes')
@Controller({
  path: '/api/eav/client/entityTypes',
  version: ['1'],
})
export class EntityTypeController {
  constructor(private service: EntityTypeService) {}

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

  @ApiOperation({ description: 'show attribute by given slug' })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}
