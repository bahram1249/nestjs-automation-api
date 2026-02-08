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
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { BasedPaymentTransactionService } from './payment-transaction.service';
import {
  GetPaymentTransactionDto,
  BasedPaymentTransactionResponseDto,
  BasedPaymentTransactionTotalResponseDto,
} from './dto';

@ApiTags('Report-PaymentTransactions-BasedLogistic')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/based-logistic/paymentTransactions',
  version: ['1'],
})
export class BasedPaymentTransactionController {
  constructor(private service: BasedPaymentTransactionService) {}

  @ApiOperation({
    description: 'show all payment transactions (based-logistic)',
  })
  @ApiJsonResponse({
    type: BasedPaymentTransactionResponseDto,
    isArray: true,
  })
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

  @ApiOperation({
    description: 'show total payment transactions (based-logistic)',
  })
  @ApiJsonResponse({
    type: BasedPaymentTransactionTotalResponseDto,
  })
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
