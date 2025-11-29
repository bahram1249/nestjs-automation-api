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
import { BasedAdminSaleService } from './admin-sale.service';
import { GetAdminSaleDto } from '../../admin-sale/dto';

@ApiTags('Report-AdminSales-BasedLogistic')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/basedLogistic/adminSales',
  version: ['1'],
})
export class BasedAdminSaleController {
  constructor(private service: BasedAdminSaleService) {}

  @ApiOperation({ description: 'show all admin sales (based-logistic)' })
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

  @ApiOperation({ description: 'show total admin sales (based-logistic)' })
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
