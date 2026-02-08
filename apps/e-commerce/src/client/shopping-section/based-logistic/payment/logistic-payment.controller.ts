import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LogisticPaymentService } from './logistic-payment.service';
import {
  LogisticStockPaymentDto,
  LogisticPaymentRequestResultDto,
  LogisticPaymentGatewayDto,
} from './dto';
import { User } from '@rahino/database';
import { ECUserSession } from '@rahino/localdatabase/models';
import { GetUser, JwtGuard } from '@rahino/auth';
import { GetECSession } from 'apps/main/src/decorator';
import { SessionGuard } from '@rahino/ecommerce/user/session/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import { LogisticPaymentGatewaysService } from './logistic-payment-gateways.service';

@Controller({
  path: '/api/ecommerce/client/shopping/based-logistic/payment',
  version: ['1'],
})
@UseGuards(SessionGuard, JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
export class LogisticPaymentController {
  constructor(
    private readonly service: LogisticPaymentService,
    private readonly gatewaysService: LogisticPaymentGatewaysService,
  ) {}

  @Post('/stock')
  @ApiOperation({ description: 'Process stock payment' })
  @ApiJsonResponse({ type: LogisticPaymentRequestResultDto })
  async stock(
    @GetUser() user: User,
    @GetECSession() session: ECUserSession,
    @Body() dto: LogisticStockPaymentDto,
  ): Promise<{ result: LogisticPaymentRequestResultDto }> {
    const result = await this.service.stock(session, dto, user);
    return { result };
  }

  @Get('/gateways')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get available payment gateways' })
  @ApiJsonResponse({ type: LogisticPaymentGatewayDto, isArray: true })
  async gateways(@GetECSession() session: ECUserSession) {
    const result = await this.gatewaysService.list(session);
    return { result };
  }
}
