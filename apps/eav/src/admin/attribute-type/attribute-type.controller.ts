import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

import { JwtGuard } from '@rahino/auth';
import { GetAttributeTypeDto } from './dto';
import { AttributeTypeService } from './attribute-type.service';

@ApiTags('EAV-Attribute-types')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/eav/admin/attributeTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class AttributeTypeController {
  constructor(private service: AttributeTypeService) {}
  @ApiOperation({ description: 'show all attribute types' })
  @CheckPermission({ permissionSymbol: 'eav.admin.attributetypes.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetAttributeTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetAttributeTypeDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show attribute type by given id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.attributetypes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}
