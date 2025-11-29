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
import { JwtGuard, GetUser } from '@rahino/auth';
import { BasedVendorSaleService } from './vendor-sale.service';
import { GetVendorSaleDto } from '../../vendor-sale/dto';
import { User } from '@rahino/database';

@ApiTags('Report-VendorSales-BasedLogistic')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/basedLogistic/vendorSales',
  version: ['1'],
})
export class BasedVendorSaleController {
  constructor(private service: BasedVendorSaleService) {}

  @ApiOperation({ description: 'show all vendor sales (based-logistic)' })
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

  @ApiOperation({ description: 'show total vendor sales (based-logistic)' })
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
