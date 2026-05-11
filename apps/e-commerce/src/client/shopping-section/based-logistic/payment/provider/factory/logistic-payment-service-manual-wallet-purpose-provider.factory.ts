import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { LogisticZarinPalService } from '../services/logistic-zarin-pal.service';
import { LogisticSnapPayService } from '../services/logistic-snap-pay.service';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class LogisticPaymentServiceManualWalletPurposeProviderFactory {
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentRepository: typeof ECPaymentGateway,
    private readonly zarinPalService: LogisticZarinPalService,
    private readonly snapPayService: LogisticSnapPayService,
    private readonly l10n: LocalizationService,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async create(paymentServiceId: number) {
    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: paymentServiceId })
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero(
            'ECPaymentGateway.isDeleted',
            0,
          ),
        )
        .build(),
    );

    if (!payment) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.payment_method_not_defined'),
      );
    }

    switch (payment.serviceName) {
      case 'ZarinPalService':
        return this.zarinPalService;
      case 'SnapPayService':
        return this.snapPayService;
      default:
        throw new NotFoundException(
          this.l10n.translate('ecommerce.invalid_data_source', {
            serviceName: payment.serviceName,
          }),
        );
    }
  }
}
