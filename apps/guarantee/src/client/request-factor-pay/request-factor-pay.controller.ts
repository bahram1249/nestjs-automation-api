import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { PickPaymentWayDto } from './dto';
import { User } from '@rahino/database';
import { RequestFactorPayService } from './request-factor-pay.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-ClientRequestFactorPay')
@Controller({
  path: '/api/guarantee/client/requestFactorPay',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class RequestFactorPayController {
  constructor(private service: RequestFactorPayService) {}

  @ApiOperation({ description: 'pick client shipmentway request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: PickPaymentWayDto) {
    return await this.service.traverse(user, dto);
  }
}
