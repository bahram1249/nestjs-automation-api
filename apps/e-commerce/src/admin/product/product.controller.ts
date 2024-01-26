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
import { GetProductDto, ProductDto } from './dto';
import { JwtGuard } from '@rahino/auth/guard';
import { ProductService } from './product.service';

@ApiTags('Admin-Product')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/ecommerce/admin/products',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ProductController {
  constructor(private service: ProductService) {}
  @ApiOperation({ description: 'show all products' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.products.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetProductDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetProductDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show product by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.products.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
  @ApiOperation({ description: 'create product by admin' })
  //@CheckPermission({ permissionSymbol: 'ecommerce.admin.products.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ProductDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update products by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.products.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') entityId: number, @Body() dto: ProductDto) {
    return await this.service.update(entityId, dto);
  }

  @ApiOperation({ description: 'delete products by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.products.delete' })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}
