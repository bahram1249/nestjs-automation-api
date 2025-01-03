import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { ProductSaleService } from './product-sale.service';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { GetVendorSaleDto } from './dto';

@ApiTags('Report-ProductSales')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/productSales',
  version: ['1'],
})
export class ProductSaleController {
  constructor(private service: ProductSaleService) {}

  @ApiOperation({ description: 'show all product sales' })
  @CheckPermission({ permissionSymbol: 'ecommerce.report.productsales.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetVendorSaleDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetVendorSaleDto) {
    return await this.service.findAll(user, filter);
  }
}
