import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { SnapPayService, ZarinPalService, WalletService } from '../services';
import { InjectModel } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';

@Injectable({ scope: Scope.REQUEST })
export class PaymentServiceProviderFactory {
  constructor(
    @Inject(REQUEST)
    private request: Request,
    @InjectModel(ECPaymentGateway)
    private readonly paymentRepository: typeof ECPaymentGateway,
    private snapPayService: SnapPayService,
    private zarinPalService: ZarinPalService,
    private walletService: WalletService,
  ) {}

  async create() {
    const paymentId = Number(this.request?.body?.paymentId);
    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: paymentId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECPaymentGateway.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!payment) {
      throw new BadRequestException('the payment method is not defined');
    }
    switch (payment.serviceName) {
      case 'SnapPayService':
        return this.snapPayService;
      case 'ZarinPalService':
        return this.zarinPalService;
      case 'WalletService':
        return this.walletService;
      default:
        throw new NotFoundException(
          `Invalid data source: ${payment.serviceName}`,
        );
    }
  }
}
