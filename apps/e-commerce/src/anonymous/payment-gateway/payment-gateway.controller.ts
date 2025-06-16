import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { PaymentGatewayService } from './payment-gateway.service';

@ApiTags('payment-gateway')
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/anonymous/paymentGateways',
  version: ['1'],
})
export class PaymentGatewayController {
  constructor(private readonly service: PaymentGatewayService) {}

  @ApiOperation({ description: 'show all payment gateways' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }
}
