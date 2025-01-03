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
import { GetPaymentTransactionDto } from './dto';
import { PaymentTransactionService } from './payment-transaction.service';

@ApiTags('Report-PaymentTransaction')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/paymentTransactions',
  version: ['1'],
})
export class PaymentTransactionController {
  constructor(private service: PaymentTransactionService) {}

  @ApiOperation({ description: 'show all payment transactions report admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.paymenttransactions.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetPaymentTransactionDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetPaymentTransactionDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show total payment transactions report' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.paymenttransactions.getall',
  })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetPaymentTransactionDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@Query() filter: GetPaymentTransactionDto) {
    return await this.service.total(filter);
  }
}
