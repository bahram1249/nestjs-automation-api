import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GSPaymentService } from './payment.service';
import { Response } from 'express';
import { SadadVerifyDto } from '../shared/payment/sadad/dto';

@ApiTags('GS-Payment')
@Controller({
  path: '/api/guarantee/payments',
  version: ['1'],
})
export class GSPaymentController {
  constructor(private service: GSPaymentService) {}

  @ApiOperation({ description: 'verify callback for sadad' })
  @Post('/sadad/verifyCallback')
  @HttpCode(HttpStatus.OK)
  async findAll(@Body() dto: SadadVerifyDto, @Res() res: Response) {
    await this.service.sadadVerfiy(dto, res);
  }
}
