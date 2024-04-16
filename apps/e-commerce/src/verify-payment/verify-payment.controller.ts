import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyPaymentService } from './veify-payment.service';
import { SnapPayDto } from './dto';

@ApiTags('verify-payment')
@Controller({
  path: '/api/ecommerce/verifyPayments',
  version: ['1'],
})
export class VerifyPaymentController {
  constructor(private readonly service: VerifyPaymentService) {}

  @ApiOperation({ description: 'verify snappay' })
  @Post('/snappay')
  @HttpCode(HttpStatus.OK)
  async verifySnappay(@Res() res, @Body() query: SnapPayDto) {
    return await this.service.verifySnappay(res, query);
  }
}
