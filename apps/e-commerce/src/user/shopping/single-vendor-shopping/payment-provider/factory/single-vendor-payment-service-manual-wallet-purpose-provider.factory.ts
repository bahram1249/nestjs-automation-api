import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { SingleVendorZarinPalService } from '../zarinpal/zarin-pal.service';

@Injectable()
export class SingleVendorPaymentServiceManualWalletPurposeProviderFactory {
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentRepository: typeof ECPaymentGateway,
    private zarinPalService: SingleVendorZarinPalService,
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
      case 'ZarinPalService':
        return this.zarinPalService;
      default:
        throw new NotFoundException(
          `Invalid data source: ${payment.serviceName}`,
        );
    }
  }
}
