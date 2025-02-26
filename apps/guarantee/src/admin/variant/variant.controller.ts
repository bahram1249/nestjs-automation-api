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
import { VariantService } from './variant.service';
import { GetVariantDto, VaraintDto } from './dto';

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
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetVariantDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show variant by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.variants.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create variant' })
  @CheckPermission({ permissionSymbol: 'gs.admin.variants.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: VaraintDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update variant by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.variants.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: number, @Body() dto: VaraintDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete variant by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.variants.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}
