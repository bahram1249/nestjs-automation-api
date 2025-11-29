import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { LogisticSnapPayService } from '../services/logistic-snap-pay.service';
import { LogisticZarinPalService } from '../services/logistic-zarin-pal.service';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';

@Injectable()
export class LogisticPaymentServiceManualProviderFactory {
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentRepository: typeof ECPaymentGateway,
    private snapPayService: LogisticSnapPayService,
    private zarinPalService: LogisticZarinPalService,
    private moduleRef: ModuleRef,
    private readonly l10n: LocalizationService,
  ) {}

  async create(paymentServiceId: number) {
    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: paymentServiceId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECPaymentGateway.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
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
      case 'SnapPayService':
        return this.snapPayService;
      case 'ZarinPalService':
        return this.zarinPalService;
      case 'WalletService':
        // Lazily resolve to avoid circular dependency
        return this.moduleRef.get<any>(
          // import type only to avoid hard DI link
          require('../services/logistic-wallet.service').LogisticWalletService,
          { strict: false },
        );
      default:
        throw new NotFoundException(
          this.l10n.translate('ecommerce.invalid_data_source', {
            serviceName: payment.serviceName,
          }),
        );
    }
  }
}
