import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECPaymentGatewayCommission } from '@rahino/database/models/ecommerce-eav/ec-paymentgateway-commission.entity';
import { ECWallet } from '@rahino/database/models/ecommerce-eav/ec-wallet.entity';
import {
  OrderStatusEnum,
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/util/enum';
import { PaymentGatewayCommissionTypeEnum } from '@rahino/ecommerce/util/enum/payment-gateway-commission-type.enum';
import { ECommmerceSmsService } from '@rahino/ecommerce/util/sms/ecommerce-sms.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as moment from 'moment-jalaali';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class FinalizedPaymentService {
  constructor(
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECOrder)
    private readonly orderRepository: typeof ECOrder,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(ECWallet)
    private readonly walletRepository: typeof ECWallet,

    @InjectModel(ECPaymentGatewayCommission)
    private readonly paymentGatewayCommissionRepository: typeof ECPaymentGatewayCommission,
    private readonly smsService: ECommmerceSmsService,
  ) {}

  async successfulSnapPay(paymentId: bigint) {
    const payment = (
      await this.paymentRepository.update(
        { paymentStatusId: PaymentStatusEnum.SuccessPayment },
        {
          where: {
            id: paymentId,
          },
          returning: true,
        },
      )
    )[1][0];

    await this.successfulOrderStatus(payment);
    await this.sendSuccessfulPaymentSms(payment);
    await this.sendSuccessfulPaymentSmsToVendor(payment);
    await this.applyPaymentGatewayCommisssion(payment.orderId);
  }

  async successfulZarinPal(
    paymentId: bigint,
    refId: string,
    cardPan: string,
    cardHash: string,
  ) {
    const payment = (
      await this.paymentRepository.update(
        {
          paymentStatusId: PaymentStatusEnum.SuccessPayment,
          transactionReceipt: refId,
          cardPan: cardPan,
          cardHash: cardHash,
        },
        {
          where: {
            id: paymentId,
          },
          returning: true,
        },
      )
    )[1][0];
    if (payment.paymentTypeId == PaymentTypeEnum.ForOrder) {
      await this.successfulOrderStatus(payment);
      await this.sendSuccessfulPaymentSms(payment);
      await this.sendSuccessfulPaymentSmsToVendor(payment);
      await this.applyPaymentGatewayCommisssion(payment.orderId);
    } else if (payment.paymentTypeId == PaymentTypeEnum.TopUpWallet) {
      let wallet = await this.walletRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ userId: payment.userId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('ECWallet.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
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

  async applyPaymentGatewayCommisssion(
    orderId: bigint,
    transaction?: Transaction,
  ) {
    let order = await this.orderRepository.findOne(
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
        .filter({
          paymentGatewayId: payment.paymentGatewayId,
        })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECPaymentGatewayCommission.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
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
      { where: { id: orderId }, transaction: transaction },
    );
  }

  async successfulOrderStatus(payment: ECPayment) {
    await this.orderRepository.update(
      {
        orderStatusId: OrderStatusEnum.Paid,
        transactionId: payment.transactionId,
        paymentId: payment.id,
      },
      {
        where: {
          id: payment.orderId,
        },
      },
    );
  }

  async sendSuccessfulPaymentSms(payment: ECPayment) {
    // here to send sms
    const userPaid = await this.userRepository.findOne(
      new QueryOptionsBuilder().filter({ id: payment.userId }).build(),
    );
    await this.smsService.successfulPayment(
      `${userPaid.firstname};${userPaid.lastname};${payment.orderId};${moment()
        .tz('Asia/Tehran', false)
        .locale('fa')
        .format('jYYYY-jMM-jDD HH:mm:ss')}`,
      userPaid.phoneNumber,
    );
  }

  async sendSuccessfulPaymentSmsToVendor(payment: ECPayment) {
    await this.smsService.successfulOrderToVendor(payment.id);
  }
}
