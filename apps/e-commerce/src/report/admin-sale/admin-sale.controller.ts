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
import { AdminSaleService } from './admin-sale.service';
import { GetAdminSaleDto } from './dto';

@ApiTags('Report-AdminSales')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/adminSales',
  version: ['1'],
})
export class AdminSaleController {
  constructor(private service: AdminSaleService) {}

  @ApiOperation({ description: 'show all admin sales' })
  @CheckPermission({ permissionSymbol: 'ecommerce.report.adminsales.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetAdminSaleDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetAdminSaleDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show total admin sales' })
  @CheckPermission({ permissionSymbol: 'ecommerce.report.adminsales.getall' })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetAdminSaleDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@Query() filter: GetAdminSaleDto) {
    return await this.service.total(filter);
  }
}
