import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Res,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { GetProductDto, ProductDto } from './dto';
import { JwtGuard } from '@rahino/auth';
import { ProductService } from './product.service';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@ApiTags('Admin-Product')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/ecommerce/admin/products',
  version: ['1'],
})
export class ProductController {
  constructor(private service: ProductService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
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
  async findAll(@GetUser() user: User, @Query() filter: GetProductDto) {
    return await this.service.findAll(user, filter);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show product by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.products.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'create product by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.products.create' })
  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: ProductDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({
    description:
      'Export products and accessible inventories to Excel (includes empty rows for accessible vendors without inventory)',
  })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.products.getall' })
  @Get('/inventories/export')
  @ApiQuery({
    name: 'filter',
    type: GetProductDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async exportInventories(
    @GetUser() user: User,
    @Query() filter: GetProductDto,
    @Res() res: Response,
  ) {
    const buffer = await this.service.exportInventoriesExcel(user, filter);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="products-inventories.xlsx"`,
    );
    res.send(buffer);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({
    description:
      'Import products inventories from Excel (insert/update accessible inventories only)',
  })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.products.create' })
  @Post('/inventories/import')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async importInventories(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.importInventoriesExcel(user, file);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'update products by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.products.update' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async update(
    @GetUser() user: User,
    @Param('id') entityId: bigint,
    @Body() dto: ProductDto,
  ) {
    return await this.service.update(entityId, user, dto);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'delete products by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.products.delete' })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') entityId: bigint) {
    return await this.service.deleteById(entityId);
  }
}
