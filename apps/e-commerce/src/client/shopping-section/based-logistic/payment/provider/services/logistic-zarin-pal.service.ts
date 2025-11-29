import {
  Injectable,
  Scope,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECPaymentGateway, ECPayment } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { User } from '@rahino/database';
import {
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LogisticPayInterface } from '../interface/logistic-pay.interface';
import { LogisticFinalizedPaymentService } from '../../util/finalized-payment/logistic-finalized-payment.service';
import { LogisticRevertPaymentQtyService } from '../../../inventory/services/logistic-revert-payment-qty.service';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';

@Injectable({ scope: Scope.REQUEST })
export class LogisticZarinPalService implements LogisticPayInterface {
  private baseUrl = 'https://api.zarinpal.com';
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentGatewayRepo: typeof ECPaymentGateway,
    @InjectModel(ECPayment)
    private readonly paymentRepo: typeof ECPayment,
    private readonly config: ConfigService,
    private readonly revertInventoryQtyService: LogisticRevertPaymentQtyService,
    private readonly finalizedPaymentService: LogisticFinalizedPaymentService,
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
    const gateway = await this.paymentGatewayRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ serviceName: 'ZarinPalService' })
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

    let payment = await this.paymentRepo.create(
      {
        paymentGatewayId: gateway.id,
        paymentTypeId: paymentType,
        paymentStatusId: PaymentStatusEnum.WaitingForPayment,
        totalprice: totalPrice * 10,
        logisticOrderId: logisticOrderId,
        userId: user.id,
        paymentVersion: 2,
      },
      { transaction },
    );

    const baseUrl = this.config.get('BASE_URL');

    const data = {
      merchant_id: gateway.username,
      callback_url: baseUrl + '/v1/api/ecommerce/verifyPayments/zarinpal',
      amount: totalPrice * 10,
      metadata: { mobile: user.phoneNumber },
      description: 'برای شماره تراکنش ' + payment.id,
    };

    try {
      const reqTx = await axios.post(
        this.baseUrl + '/pg/v4/payment/request.json',
        data,
      );

      console.log(reqTx);
      if (reqTx.status < 200 || reqTx.status > 299) {
        throw new BadRequestException(
          this.l10n.translate('ecommerce.invalid_payment'),
        );
      }

      payment = (
        await this.paymentRepo.update(
          { paymentToken: reqTx.data.data.authority },
          { where: { id: payment.id }, transaction, returning: true },
        )
      )[1][0];

      return {
        redirectUrl:
          'https://www.zarinpal.com' +
          '/pg/StartPay/' +
          reqTx.data.data.authority,
        paymentId: payment.id,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.payment_request_failed', {
          message: error.message,
        }),
      );
    }
  }

  async eligbleRequest(totalPrice: number) {
    return {
      eligibleCheck: true,
      titleMessage: 'پرداخت نقدی با زرین پال',
      description: 'پرداخت مستقیم با تمامی کارت های عضو شتاب',
    };
  }

  async verify(res: any, query: { Authority: string; Status: string }) {
    const paymentGateway = await this.paymentGatewayRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ serviceName: 'ZarinPalService' })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!paymentGateway) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );
    }

    const payment = await this.paymentRepo.findOne(
      new QueryOptionsBuilder()
        .filter({ paymentToken: query.Authority })
        .filter({ paymentGatewayId: paymentGateway.id })
        .filter({ paymentStatusId: PaymentStatusEnum.WaitingForPayment })
        .build(),
    );
    if (!payment) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );
    }

    if (query.Status != 'OK') {
      if (payment.paymentTypeId == PaymentTypeEnum.ForOrder) {
        await this.revertInventoryQtyService.revertPaymentAndQty(payment.id);
      }
    } else {
      const verifyRequest = await axios.post(
        this.baseUrl + '/pg/v4/payment/verify.json',
        {
          authority: query.Authority,
          amount: payment.totalprice,
          merchant_id: paymentGateway.username,
        },
      );
      if (verifyRequest.data.data.code == 100) {
        await this.finalizedPaymentService.successfulZarinPal(
          payment.id,
          verifyRequest.data.data.ref_id,
          verifyRequest.data.data.card_pan,
          verifyRequest.data.data.card_hash,
        );
      } else {
        if (payment.paymentTypeId == PaymentTypeEnum.ForOrder) {
          await this.revertInventoryQtyService.revertPaymentAndQty(payment.id);
        }
        throw new BadRequestException(
          this.l10n.translate('ecommerce.invalid_payment'),
        );
      }
    }
    const frontUrl = this.config.get('BASE_FRONT_URL');
    return res.redirect(
      301,
      frontUrl + `/payment/transaction?transactionId=${payment.id}`,
    );
  }
}
