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
import { VariationPriceEnum } from '../../../stock/enum';
import { SingleVendorZarinPalService } from '../zarinpal/zarin-pal.service';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class SingleVendorPaymentServiceManualProviderFactory {
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentRepository: typeof ECPaymentGateway,
    private zarinPalService: SingleVendorZarinPalService,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async create(paymentServiceId: number) {
    const paymentId = paymentServiceId;
    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: paymentId })
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero(
            'ECPaymentGateway.isDeleted',
            0,
          ),
        )
        .filter({ variationPriceId: VariationPriceEnum.firstPrice })
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
