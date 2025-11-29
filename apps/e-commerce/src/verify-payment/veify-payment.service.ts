import { Injectable, BadRequestException } from '@nestjs/common';
import { SnapPayDto, ZarinPalDto } from './dto';
import {
  SnapPayService,
  ZarinPalService,
} from '../user/shopping/payment/provider/services';
import { Response } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { PaymentStatusEnum } from '@rahino/ecommerce/shared/enum';
import { LogisticSnapPayService } from '../client/shopping-section/based-logistic/payment/provider/services/logistic-snap-pay.service';
import { LogisticZarinPalService } from '../client/shopping-section/based-logistic/payment/provider/services/logistic-zarin-pal.service';

@Injectable()
export class VerifyPaymentService {
  constructor(
    private readonly snapPayService: SnapPayService,
    private readonly zarinPalService: ZarinPalService,
    private readonly logisticSnapPayService: LogisticSnapPayService,
    private readonly logisticZarinPalService: LogisticZarinPalService,
    @InjectModel(ECPayment)
    private readonly paymentRepo: typeof ECPayment,
  ) {}
  async verifySnappay(res: Response, query: SnapPayDto) {
    // Find the payment by transactionId to determine version
    const payment = await this.paymentRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ transactionId: query.transactionId })
        .filter({ paymentStatusId: PaymentStatusEnum.WaitingForPayment })
        .build(),
    );
    if (!payment) throw new BadRequestException('invalid payment');

    if (payment.paymentVersion === 2) {
      return await this.logisticSnapPayService.verify(res as any, query as any);
    }
    return await this.snapPayService.verify(res, query);
  }

  async verifyZarinPal(res: any, query: ZarinPalDto) {
    // Find the payment by Authority/paymentToken to determine version
    const payment = await this.paymentRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ paymentToken: query.Authority })
        .filter({ paymentStatusId: PaymentStatusEnum.WaitingForPayment })
        .build(),
    );
    if (!payment) throw new BadRequestException('invalid payment');

    if (payment.paymentVersion === 2) {
      return await this.logisticZarinPalService.verify(res, query as any);
    }
    return await this.zarinPalService.verify(res, query);
  }
}
