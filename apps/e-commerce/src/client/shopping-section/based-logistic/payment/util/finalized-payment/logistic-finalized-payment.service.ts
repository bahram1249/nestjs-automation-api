import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import {
  ECLogisticOrderGrouped,
  ECPayment,
  ECPaymentGatewayCommission,
  ECWallet,
} from '@rahino/localdatabase/models';
import { ECLogisticOrder } from '@rahino/localdatabase/models';
import { LogisticEcommerceSmsService } from '../../../sms/logistic-ecommerce-sms.service';
import {
  OrderStatusEnum,
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import { PaymentGatewayCommissionTypeEnum } from '@rahino/ecommerce/shared/enum/payment-gateway-commission-type.enum';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as moment from 'moment-jalaali';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';

@Injectable()
export class LogisticFinalizedPaymentService {
  constructor(
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECLogisticOrder)
    private readonly orderRepository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly orderGroupedRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(ECWallet)
    private readonly walletRepository: typeof ECWallet,

    @InjectModel(ECPaymentGatewayCommission)
    private readonly paymentGatewayCommissionRepository: typeof ECPaymentGatewayCommission,
    private readonly smsService: LogisticEcommerceSmsService,
    private readonly l10n: LocalizationService,
  ) {}

  async successfulSnapPay(paymentId: bigint) {
    const payment = (
      await this.paymentRepository.update(
        { paymentStatusId: PaymentStatusEnum.SuccessPayment },
        { where: { id: paymentId }, returning: true },
      )
    )[1][0];

    await this.successfulOrderStatus(payment);
    await this.sendSuccessfulPaymentSms(payment);
    await this.sendSuccessfulPaymentSmsToVendor(payment);
    await this.applyPaymentGatewayCommisssion(payment.logisticOrderId);
  }

  async successfulZarinPal(
    paymentId: bigint,
    refId: string,
    cardPan: string,
    cardHash: string,
    transaction?: Transaction,
  ) {
    const payment = (
      await this.paymentRepository.update(
        {
          paymentStatusId: PaymentStatusEnum.SuccessPayment,
          transactionReceipt: refId,
          cardPan: cardPan,
          cardHash: cardHash,
        },
        { where: { id: paymentId }, returning: true, transaction },
      )
    )[1][0];

    if (payment.paymentTypeId == PaymentTypeEnum.ForOrder) {
      await this.successfulOrderStatus(payment, transaction);
      await this.sendSuccessfulPaymentSms(payment);
      await this.sendSuccessfulPaymentSmsToVendor(payment, transaction);
      await this.applyPaymentGatewayCommisssion(
        payment.logisticOrderId,
        transaction,
      );
    } else if (payment.paymentTypeId == PaymentTypeEnum.TopUpWallet) {
      let wallet = await this.walletRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ userId: payment.userId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('ECWallet.isDeleted'), 0),
              { [Op.eq]: 0 },
            ),
          )
          .build(),
      );
      wallet.currentAmount = BigInt(
        Number(wallet.currentAmount) + Number(payment.totalprice) / 10,
      );
      wallet = await wallet.save();
    }
  }

  async successfulWallet(paymentId: bigint, transaction?: Transaction) {
    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: paymentId })
        .filter({ paymentStatusId: PaymentStatusEnum.DecreaseAmountOfWallet })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECPayment.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .transaction(transaction)
        .build(),
    );

    if (!payment) {
      throw new NotFoundException(
        this.l10n.translate('ecommerce.payment_not_found'),
      );
    }

    if (payment.paymentTypeId == PaymentTypeEnum.ForOrder) {
      await this.successfulOrderStatus(payment, transaction);
      await this.sendSuccessfulPaymentSms(payment);
      await this.sendSuccessfulPaymentSmsToVendor(payment, transaction);
      await this.applyPaymentGatewayCommisssion(
        payment.logisticOrderId,
        transaction,
      );
    }
  }

  async applyPaymentGatewayCommisssion(
    orderId: bigint,
    transaction?: Transaction,
  ) {
    const order = await this.orderRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: orderId })
        .transaction(transaction)
        .build(),
    );
    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: order.paymentId })
        .transaction(transaction)
        .build(),
    );
    let amount = 0;
    const commisssion = await this.paymentGatewayCommissionRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ paymentGatewayId: payment.paymentGatewayId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECPaymentGatewayCommission.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .transaction(transaction)
        .build(),
    );

    if (
      commisssion &&
      commisssion.commissionTypeId ==
        PaymentGatewayCommissionTypeEnum.byPercentage
    ) {
      amount = (Number(order.totalPrice) * Number(commisssion.amount)) / 100;
    } else if (
      commisssion &&
      commisssion.commissionTypeId == PaymentGatewayCommissionTypeEnum.byAmount
    ) {
      amount = Number(commisssion.amount);
    }
    await this.orderRepository.update(
      { paymentCommissionAmount: amount },
      { where: { id: orderId }, transaction },
    );
  }

  async successfulOrderStatus(payment: ECPayment, transaction?: Transaction) {
    await this.orderRepository.update(
      {
        orderStatusId: OrderStatusEnum.Paid,
        transactionId: payment.transactionId,
        paymentId: payment.id,
      },
      { where: { id: payment.logisticOrderId }, transaction },
    );

    await this.orderGroupedRepository.update(
      {
        orderStatusId: OrderStatusEnum.Paid,
      },
      {
        where: {
          logisticOrderId: payment.logisticOrderId,
        },
        transaction: transaction,
      },
    );
  }

  async sendSuccessfulPaymentSms(payment: ECPayment) {
    const userPaid = await this.userRepository.findOne(
      new QueryOptionsBuilder().filter({ id: payment.userId }).build(),
    );
    await this.smsService.successfulPayment(
      `${userPaid.firstname};${userPaid.lastname};${payment.logisticOrderId};${moment()
        .tz('Asia/Tehran', false)
        .locale('fa')
        .format('jYYYY-jMM-jDD HH:mm:ss')}`,
      userPaid.phoneNumber,
    );
  }

  async sendSuccessfulPaymentSmsToVendor(
    payment: ECPayment,
    transaction?: Transaction,
  ) {
    await this.smsService.successfulOrderToVendor(payment.id, transaction);
  }
}
