import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { SessionGuard } from '../../session/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { PaymentService } from './payment.service';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/localdatabase/models';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { StockPaymentDto, WalletPaymentDto } from './dto';

@ApiTags('payments')
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/payments',
  version: ['1'],
})
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @UseGuards(JwtGuard, SessionGuard)
  @ApiOperation({ description: 'request stock payment' })
  @Post('/stock')
  @HttpCode(HttpStatus.OK)
  async stock(
    @GetECSession() session: ECUserSession,
    @Body() body: StockPaymentDto,
    @GetUser() user: User,
  ) {
    return await this.service.stock(session, body, user);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ description: 'request charging wallet payment' })
  @Post('/walletCharging')
  @HttpCode(HttpStatus.OK)
  async walletCharging(@Body() body: WalletPaymentDto, @GetUser() user: User) {
    return await this.service.walletCharging(user, body);
  }
}
