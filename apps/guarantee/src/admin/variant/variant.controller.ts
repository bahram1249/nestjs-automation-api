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
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth';
import { VariantService } from './variant.service';
import {
  GetVariantDto,
  VaraintDto,
  GuaranteeAdminVariantResponseDto,
} from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Variants')
@Controller({
  path: '/api/guarantee/admin/variants',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class VariantController {
  constructor(private service: VariantService) {}

  @ApiOperation({ description: 'show all brands' })
  @CheckPermission({ permissionSymbol: 'gs.admin.brands.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetVariantDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: GuaranteeAdminVariantResponseDto,
    isArray: true,
    description: 'List of variants retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetVariantDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show variant by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.variants.getone' })
  @Get('/:id')
  @ApiJsonResponse({
    type: GuaranteeAdminVariantResponseDto,
    description: 'Variant retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create variant' })
  @CheckPermission({ permissionSymbol: 'gs.admin.variants.create' })
  @Post('/')
  @ApiJsonResponse({
    type: GuaranteeAdminVariantResponseDto,
    status: 201,
    description: 'Variant created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: VaraintDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update variant by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.variants.update' })
  @Put('/:id')
  @ApiJsonResponse({
    type: GuaranteeAdminVariantResponseDto,
    description: 'Variant updated successfully',
  })
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: number, @Body() dto: VaraintDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete variant by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.variants.delete' })
  @Delete('/:id')
  @ApiJsonResponse({
    type: GuaranteeAdminVariantResponseDto,
    description: 'Variant deleted successfully',
  })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}
