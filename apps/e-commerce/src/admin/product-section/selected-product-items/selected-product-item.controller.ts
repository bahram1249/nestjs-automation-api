import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
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
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { SelectedProductItemService } from './selected-product-item.service';
import { SelectedProductItemDto, GetSelectedProductItemDto } from './dto';

@ApiTags('Admin-SelectedProductItems')
@Controller({
  path: '/api/ecommerce/admin/selectedProductItems',
  version: ['1'],
})
export class SelectedProductItemController {
  constructor(private service: SelectedProductItemService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @CheckPermission({
    permissionSymbol: 'ecommerce.selectedproductsitems.getall',
  })
  @ApiOperation({ description: 'show all selected products' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetSelectedProductItemDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetSelectedProductItemDto) {
    return await this.service.findAll(filter);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'create selected product items by admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.selectedproductsitems.create',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: SelectedProductItemDto) {
    return await this.service.create(dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'delete selected product item by admin' })
  @Delete('/')
  @CheckPermission({
    permissionSymbol: 'ecommerce.selectedproductsitems.delete',
  })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Body() dto: SelectedProductItemDto) {
    return await this.service.deleteItem(dto);
  }
}
