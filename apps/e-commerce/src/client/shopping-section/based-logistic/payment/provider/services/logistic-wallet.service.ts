import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { Op } from 'sequelize';
import { User } from '@rahino/database';
import {
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import {
  ECWallet,
  ECPaymentGateway,
  ECPayment,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LogisticFinalizedPaymentService } from '../../util/finalized-payment/logistic-finalized-payment.service';
import { ConfigService } from '@nestjs/config';
import { LogisticPayInterface } from '../interface/logistic-pay.interface';
import { LogisticPaymentServiceManualWalletPurposeProviderFactory } from '../factory/logistic-payment-service-manual-wallet-purpose-provider.factory';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';

@Injectable({ scope: Scope.REQUEST })
export class LogisticWalletService implements LogisticPayInterface {
  constructor(
    @InjectModel(ECWallet)
    private readonly walletRepo: typeof ECWallet,
    @InjectModel(ECPaymentGateway)
    private readonly gatewayRepo: typeof ECPaymentGateway,
    @InjectModel(ECPayment)
    private readonly paymentRepo: typeof ECPayment,
    private readonly finalizedPaymentService: LogisticFinalizedPaymentService,
    private readonly walletPurposeProviderFactory: LogisticPaymentServiceManualWalletPurposeProviderFactory,
    private readonly config: ConfigService,
    private readonly l10n: LocalizationService,
  ) {}

  async eligbleToRevert(paymentId: bigint): Promise<boolean> {
    return true;
  }

  async requestPayment(
    totalPrice: number,
    discountAmount: number,
    shipmentAmount: number,
    user: User,
    paymentType: PaymentTypeEnum,
    transaction?: Transaction,
    logisticOrderId?: bigint,
  ): Promise<{ redirectUrl: string; paymentId: bigint }> {
    const wallet = await this.walletRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .transaction(transaction)
        .build(),
    );
    if (!wallet)
      throw new BadRequestException(
        this.l10n.translate('ecommerce.main_wallet_not_found'),
      );

    const gateway = await this.gatewayRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ serviceName: 'WalletService' })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );
    if (!gateway)
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );

    // amounts are in toman; ECPayment.totalprice stored in rial (x10)
    if (Number(wallet.currentAmount) >= totalPrice) {
      // enough balance: decrease and finalize immediately
      const currentWalletAmount = Number(wallet.currentAmount) - totalPrice;
      await this.walletRepo.update(
        { currentAmount: currentWalletAmount },
        { where: { id: wallet.id }, transaction },
      );

      const payment = await this.paymentRepo.create(
        {
          paymentGatewayId: gateway.id,
          paymentTypeId: paymentType,
          paymentStatusId: PaymentStatusEnum.DecreaseAmountOfWallet,
          totalprice: totalPrice * 10,
          logisticOrderId: logisticOrderId,
          userId: user.id,
        },
        { transaction },
      );

      await this.finalizedPaymentService.successfulWallet(
        payment.id,
        transaction,
      );

      const frontUrl = this.config.get('BASE_FRONT_URL');
      return {
        paymentId: payment.id,
        redirectUrl: `${frontUrl}/user/orders/${payment.logisticOrderId}`,
      };
    }

    // not enough: charge the difference using another gateway eligible for wallet charging
    const chargerGateway = await this.gatewayRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ eligibleChargeWallet: true })
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
    if (!chargerGateway) {
      throw new ForbiddenException(
        this.l10n.translate('ecommerce.payment_for_charging_not_found'),
      );
    }

    const mustBePaid = totalPrice - Number(wallet.currentAmount);

    // pick a provider by charger gateway id using wallet-purpose factory (avoids circular deps)
    const chargeProvider = (await this.walletPurposeProviderFactory.create(
      chargerGateway.id,
    )) as LogisticPayInterface;
    const paymentResult = await chargeProvider.requestPayment(
      mustBePaid,
      0,
      0,
      user,
      paymentType,
      transaction,
      logisticOrderId,
    );

    // create a wallet decrease payment for the wallet portion (if any)
    if (Number(wallet.currentAmount) > 0) {
      await this.paymentRepo.create(
        {
          paymentGatewayId: gateway.id,
          paymentTypeId: paymentType,
          paymentStatusId: PaymentStatusEnum.DecreaseAmountOfWallet,
          totalprice: Number(wallet.currentAmount) * 10,
          logisticOrderId: logisticOrderId,
          userId: user.id,
          parentPaymentId: paymentResult.paymentId,
        },
        { transaction },
      );

      // move wallet currentAmount to suspendedAmount until charge payment completes
      await this.walletRepo.update(
        {
          suspendedAmount:
            Number(wallet.suspendedAmount) + Number(wallet.currentAmount),
          currentAmount: 0,
        },
        { where: { id: wallet.id }, transaction },
      );
    }

    return {
      paymentId: paymentResult.paymentId,
      redirectUrl: paymentResult.redirectUrl,
    };
  }

  async eligbleRequest(totalPrice: number, user?: User) {
    if (!user) {
      return {
        eligibleCheck: false,
        titleMessage: 'پرداخت با کیف پول',
        description: '',
      };
    }
    const wallet = await this.walletRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );
    if (!wallet)
      throw new BadRequestException(
        this.l10n.translate('ecommerce.main_wallet_not_found'),
      );

    return {
      eligibleCheck: true,
      titleMessage: 'پرداخت با کیف پول',
      description: `موجودی کیف پول شما (${Number(wallet.currentAmount).toLocaleString()}) تومان هست`,
    };
  }
}
