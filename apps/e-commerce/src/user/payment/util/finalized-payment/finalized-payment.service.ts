import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import {
  OrderStatusEnum,
  PaymentStatusEnum,
} from '@rahino/ecommerce/util/enum';
import { ECommmerceSmsService } from '@rahino/ecommerce/util/sms/ecommerce-sms.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as moment from 'moment-jalaali';

@Injectable()
export class FinalizedPaymentService {
  constructor(
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECOrder)
    private readonly orderRepository: typeof ECOrder,
    @InjectModel(User)
    private readonly userRepository: typeof User,
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
    await this.successfulOrderStatus(payment);
    await this.sendSuccessfulPaymentSms(payment);
    await this.sendSuccessfulPaymentSmsToVendor(payment);
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
