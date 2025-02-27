import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SnapPayService, ZarinPalService, WalletService } from '../services';
import { InjectModel } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class PaymentServiceManualProviderFactory {
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentRepository: typeof ECPaymentGateway,
    private snapPayService: SnapPayService,
    private zarinPalService: ZarinPalService,
    private walletService: WalletService,
  ) {}

  async create(paymentServiceId: number) {
    const paymentId = paymentServiceId;
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
