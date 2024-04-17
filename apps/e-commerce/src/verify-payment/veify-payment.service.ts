import { Injectable } from '@nestjs/common';
import { SnapPayDto, ZarinPalDto } from './dto';
import {
  SnapPayService,
  ZarinPalService,
} from '../user/payment/provider/services';
import { Response } from 'express';

@Injectable()
export class VerifyPaymentService {
  constructor(
    private readonly snapPayService: SnapPayService,
    private readonly zarinPalService: ZarinPalService,
  ) {}
  async verifySnappay(res: Response, query: SnapPayDto) {
    return await this.snapPayService.verify(res, query);
  }

  async verifyZarinPal(res: any, query: ZarinPalDto) {
    return await this.zarinPalService.verify(res, query);
  }
}
