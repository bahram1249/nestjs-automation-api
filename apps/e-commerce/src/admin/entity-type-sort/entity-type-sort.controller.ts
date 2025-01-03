import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EntityTypeSortService } from './entity-type-sort.service';
import { JwtGuard } from '@rahino/auth';

@ApiTags('Admin-EntityTypeSorts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({
  path: '/api/ecommerce/admin/entityTypeSorts',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class EntityTypeSortController {
  constructor(private service: EntityTypeSortService) {}

  // public url
  @ApiOperation({ description: 'show all entity type sorts' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }
}
