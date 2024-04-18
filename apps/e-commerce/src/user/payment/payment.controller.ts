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
import { JwtGuard } from '@rahino/auth/guard';
import { SessionGuard } from '../session/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { PaymentService } from './payment.service';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';
import { StockPaymentDto } from './dto';

@ApiTags('payments')
@UseGuards(JwtGuard, SessionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/payments',
  version: ['1'],
})
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

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
}
