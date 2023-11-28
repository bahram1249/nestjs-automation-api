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
import { AttributeDto, GetAttributeDto } from './dto';
import { AttributeService } from './attribute.service';

@ApiTags('EAV-Attribute')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/eav/admin/attributes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class AttributeController {
  constructor(private service: AttributeService) {}
  @ApiOperation({ description: 'show all attribute' })
  @CheckPermission({ permissionSymbol: 'eav.admin.attribute.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetAttributeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetAttributeDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show attribute by given id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.attribute.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create attribute by entity type' })
  @CheckPermission({ permissionSymbol: 'eav.admin.attribute.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: AttributeDto) {
    return await this.service.create(dto);
  }
}
