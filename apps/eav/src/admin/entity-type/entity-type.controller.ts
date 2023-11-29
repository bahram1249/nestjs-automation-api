import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth/guard';
import { EntityTypeDto, GetEntityTypeDto } from './dto';
import { EntityTypeService } from './entity-type.service';

@ApiTags('EAV-Attribute')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/eav/admin/entityTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class EntityTypeController {
  constructor(private service: EntityTypeService) {}
  @ApiOperation({ description: 'show all entitytypes' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.getall' })
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

  @ApiOperation({ description: 'show attribute by given id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create entity type by modeltypeid' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: EntityTypeDto) {
    return await this.service.create(dto);
  }
}
