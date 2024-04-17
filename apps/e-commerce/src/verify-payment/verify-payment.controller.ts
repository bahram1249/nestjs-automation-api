import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyPaymentService } from './veify-payment.service';
import { SnapPayDto, ZarinPalDto } from './dto';

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

  @ApiOperation({ description: 'verify snappay' })
  @Get('/zarinpal')
  @HttpCode(HttpStatus.OK)
  async verifyZarinPal(@Res() res, @Query() query: ZarinPalDto) {
    return await this.service.verifyZarinPal(res, query);
  }
}
