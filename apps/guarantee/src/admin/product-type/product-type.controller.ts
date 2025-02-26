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
import { ProductTypeService } from './product-type.service';
import { GetProductTypeDto, ProductTypeDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-ProductTypes')
@Controller({
  path: '/api/guarantee/admin/productTypes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ProductTypeController {
  constructor(private service: ProductTypeService) {}

  @ApiOperation({ description: 'show all product types' })
  @CheckPermission({ permissionSymbol: 'gs.admin.producttypes.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetProductTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetProductTypeDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show product type by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.producttypes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create product type' })
  @CheckPermission({ permissionSymbol: 'gs.admin.producttypes.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ProductTypeDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update product type by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.producttypes.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: number, @Body() dto: ProductTypeDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete product type by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.producttypes.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}
