import { Injectable } from '@nestjs/common';
import { SnapPayDto } from './dto';
import { SnapPayService } from '../user/payment/provider/services';
import { Response } from 'express';

@Injectable()
export class VerifyPaymentService {
  constructor(private readonly snapPayService: SnapPayService) {}
  async verifySnappay(res: Response, query: SnapPayDto) {
    return await this.snapPayService.verify(res, query);
  }
}
