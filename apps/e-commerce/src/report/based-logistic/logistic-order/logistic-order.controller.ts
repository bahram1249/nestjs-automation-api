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
import { GetLogisticOrderDto } from './dto';
import { LogisticOrderService } from './logistic-order.service';

@ApiTags('Report-LogisticOrder')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/based-logistic/logisticOrders',
  version: ['1'],
})
export class LogisticOrderController {
  constructor(private service: LogisticOrderService) {}

  @ApiOperation({ description: 'show all logistic orders (based-logistic) report' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.admincouriers.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetLogisticOrderDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetLogisticOrderDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show total logistic orders (based-logistic) report' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.admincouriers.getall',
  })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetLogisticOrderDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@Query() filter: GetLogisticOrderDto) {
    return await this.service.total(filter);
  }
}
