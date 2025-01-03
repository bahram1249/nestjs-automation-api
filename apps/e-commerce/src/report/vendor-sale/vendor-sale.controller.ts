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
import { VendorSaleService } from './vendor-sale.service';
import { GetVendorSaleDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('Report-VendorSales')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/vendorSales',
  version: ['1'],
})
export class VendorSaleController {
  constructor(private service: VendorSaleService) {}

  @ApiOperation({ description: 'show all vendor sales' })
  @CheckPermission({ permissionSymbol: 'ecommerce.report.vendorsales.getall' })
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

  @ApiOperation({ description: 'show total vendor sales' })
  @CheckPermission({ permissionSymbol: 'ecommerce.report.vendorsales.getall' })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetVendorSaleDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@GetUser() user: User, @Query() filter: GetVendorSaleDto) {
    return await this.service.total(user, filter);
  }
}
