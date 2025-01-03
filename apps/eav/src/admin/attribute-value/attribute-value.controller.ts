import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { AttributeValueDto, GetAttributeValueDto } from './dto';
import { AttributeValueService } from './attribute-value.service';

@ApiTags('EAV-AttributeValue')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/eav/admin/attributeValues',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class AttributeValueController {
  constructor(private service: AttributeValueService) {}
  @ApiOperation({ description: 'show all attribute' })
  @CheckPermission({ permissionSymbol: 'eav.admin.attributevalue.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetAttributeValueDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetAttributeValueDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show attribute value by given id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.attributevalue.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create attribute value by attribute id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.attributevalue.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: AttributeValueDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update attribute value by id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.attributevalue.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: bigint, @Body() dto: AttributeValueDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete attribute value by id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.attributevalue.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: bigint) {
    return await this.service.deleteById(entityId);
  }
}
