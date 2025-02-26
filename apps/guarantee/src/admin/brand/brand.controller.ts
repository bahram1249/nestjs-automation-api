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
import { BrandService } from './brand.service';
import { GetBrandDto, BrandDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Brands')
@Controller({
  path: '/api/guarantee/admin/brands',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class BrandController {
  constructor(private service: BrandService) {}

  @ApiOperation({ description: 'show all brands' })
  @CheckPermission({ permissionSymbol: 'gs.admin.brands.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetBrandDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetBrandDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show brand by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.brands.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create brand' })
  @CheckPermission({ permissionSymbol: 'gs.admin.brands.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: BrandDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update brand by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.brands.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: number, @Body() dto: BrandDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete brand by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.brands.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}
