import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
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
  @Get('/snappay')
  @HttpCode(HttpStatus.OK)
  async verifySnappay(@Res() res, @Query() query: SnapPayDto) {
    return await this.service.verifySnappay(res, query);
  }
}
