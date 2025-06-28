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
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/localdatabase/models';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { SingleVendorPaymentService } from './payment.service';
import { SessionGuard } from '@rahino/ecommerce/user/session/guard';
import { SingleVendorShoppingPaymentDto } from './dto';

@ApiTags('SingleVendorPayments')
@ApiBearerAuth()
@UseGuards(JwtGuard, SessionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/client/singleVendorPayments',
  version: ['1'],
})
export class SingleVendorPaymentController {
  constructor(private readonly service: SingleVendorPaymentService) {}

  @ApiOperation({ description: 'request stock payment' })
  @Post('/shoppingPayment')
  @HttpCode(HttpStatus.OK)
  async stock(
    @GetECSession() session: ECUserSession,
    @Body() body: SingleVendorShoppingPaymentDto,
    @GetUser() user: User,
  ) {
    return await this.service.shoppingPayment(session, body, user);
  }

  // @UseGuards(JwtGuard)
  // @ApiOperation({ description: 'request charging wallet payment' })
  // @Post('/walletCharging')
  // @HttpCode(HttpStatus.OK)
  // async walletCharging(@Body() body: WalletPaymentDto, @GetUser() user: User) {
  //   return await this.service.walletCharging(user, body);
  // }
}
