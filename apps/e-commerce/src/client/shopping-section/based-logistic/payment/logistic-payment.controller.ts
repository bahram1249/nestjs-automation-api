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
import { LogisticPaymentService } from './logistic-payment.service';
import {
  LogisticStockPaymentDto,
  LogisticPaymentRequestResult,
} from './dto/logistic-payment.dto';
import { User } from '@rahino/database';
import { ECUserSession } from '@rahino/localdatabase/models';
import { GetUser, JwtGuard } from '@rahino/auth';
import { GetECSession } from 'apps/main/src/decorator';
import { SessionGuard } from '@rahino/ecommerce/user/session/guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
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
  async stock(
    @GetUser() user: User,
    @GetECSession() session: ECUserSession,
    @Body() dto: LogisticStockPaymentDto,
  ): Promise<{ result: LogisticPaymentRequestResult }> {
    const result = await this.service.stock(session, dto, user);
    return { result };
  }

  @Get('/gateways')
  @HttpCode(HttpStatus.OK)
  async gateways(@GetECSession() session: ECUserSession) {
    const result = await this.gatewaysService.list(session);
    return { result };
  }
}
