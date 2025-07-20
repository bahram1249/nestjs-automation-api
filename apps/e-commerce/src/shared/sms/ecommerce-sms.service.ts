import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { ECOrder } from '@rahino/localdatabase/models';
import { ECPayment } from '@rahino/localdatabase/models';
import { ECVendorUser } from '@rahino/localdatabase/models';
import { ECVendor } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { SMS_SERVICE } from '@rahino/sms/contants';
import { SmsService } from '@rahino/sms/sms.service';
import { Op, Sequelize, Transaction } from 'sequelize';
import * as moment from 'moment-jalaali';

@Injectable()
export class ECommmerceSmsService {
  constructor(
    @Inject(SMS_SERVICE)
    private readonly smsService: SmsService,
    private readonly config: ConfigService,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECOrder)
    private readonly orderRepository: typeof ECOrder,
    @InjectModel(ECVendor)
    private readonly vendorRepository: typeof ECVendor,
  ) {}

  async loginSms(text: string, to: string) {
    /*
    کد تایید شما : {0} جهیزان
    */
    const loginBody = this.config.get('ECOMMERCE_LOGIN_SMS_CODE');
    await this.smsService.sendMessage({
      text: text,
      to: to,
      bodyId: loginBody,
    });
  }

  async processOrder(text: string, to: string) {
    /*
      سفارش شما به شماره {0} درحال آماده سازی میباشد و بزودی ارسال میشود
    */
    const activeSms =
      (await this.config.get('ECOMMERCE_PROCESSED_SMS_CODE_STATUS')) == 'true';
    if (activeSms == true) {
      const body = this.config.get('ECOMMERCE_PROCESSED_SMS_CODE');
      await this.smsService.sendMessage({
        text: text,
        to: to,
        bodyId: body,
      });
    }
  }

  async sendByCourier(text: string, to: string) {
    /*
    {0} {1} عزیز، سفارش شما توسط {2} با کدپیگیری {3} با موفقیت ارسال شد
    */
    const activeSms =
      (await this.config.get('ECOMMERCE_COURIER_SEND_SMS_CODE_STATUS')) ==
      'true';
    if (activeSms == true) {
      const body = this.config.get('ECOMMERCE_COURIER_SEND_SMS_CODE');
      await this.smsService.sendMessage({
        text: text,
        to: to,
        bodyId: body,
      });
    }
  }

  async sendByPost(text: string, to: string) {
    /*
    {0} {1} عزیز، سفارش شما توسط {2} با کدپیگیری {3} با موفقیت ارسال شد
    */
    const activeSms =
      (await this.config.get('ECOMMERCE_POST_SEND_SMS_CODE_STATUS')) == 'true';
    if (activeSms == true) {
      const body = this.config.get('ECOMMERCE_POST_SEND_SMS_CODE');
      await this.smsService.sendMessage({
        text: text,
        to: to,
        bodyId: body,
      });
    }
  }

  async successfulPayment(text: string, to: string) {
    /*
    {0} {1} عزیز سفارش شما با شماره {2} در تاریخ {3} ثبت و پرداخت شد. جهیزان
    */
    const activeSms =
      (await this.config.get('ECOMMERCE_SUSSESSFUL_PAYMENT_SMS_CODE_STATUS')) ==
      'true';
    if (activeSms == true) {
      const body = this.config.get('ECOMMERCE_SUSSESSFUL_PAYMENT_SMS_CODE');
      await this.smsService.sendMessage({
        text: text,
        to: to,
        bodyId: body,
      });
    }
  }

  async successfulOrderToVendor(paymentId: bigint, transaction?: Transaction) {
    const activeSms =
      (await this.config.get('ECOMMERCE_SUSSESSFUL_ORDER_SMS_STATUS')) ==
      'true';
    if (activeSms == true) {
      const payment = await this.paymentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: paymentId })
          .transaction(transaction)
          .build(),
      );
      const order = await this.orderRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: payment.orderId })
          .include([
            {
              model: ECOrderDetail,
              as: 'details',
            },
          ])
          .transaction(transaction)
          .build(),
      );
      const vendorIds = Array.from(
        new Set<number>(order.details.map((item) => item.vendorId)),
      );

      const vendors = await this.vendorRepository.findAll(
        new QueryOptionsBuilder()
          .filter({
            id: {
              [Op.in]: vendorIds,
            },
          })
          .include([
            {
              model: ECVendorUser,
              as: 'vendorUser',
              include: [
                {
                  attributes: [
                    'id',
                    'firstname',
                    'lastname',
                    'username',
                    'phoneNumber',
                  ],
                  model: User,
                  as: 'user',
                },
              ],
              where: {
                [Op.and]: [
                  {
                    isDefault: true,
                  },
                  Sequelize.where(
                    Sequelize.fn(
                      'isnull',
                      Sequelize.col('vendorUser.isDeleted'),
                      0,
                    ),
                    {
                      [Op.eq]: 0,
                    },
                  ),
                ],
              },
            },
          ])
          .build(),
      );

      const body = this.config.get('ECOMMERCE_SUSSESSFUL_ORDER_SMS_CODE');

      for (let index = 0; index < vendors.length; index++) {
        const vendor = vendors[index];
        await this.smsService.sendMessage({
          text: `${vendor.name};${moment()
            .tz('Asia/Tehran', false)
            .locale('fa')
            .format('jYYYY-jMM-jDD HH:mm:ss')}`,
          to: vendor.vendorUser.user.phoneNumber,
          bodyId: body,
        });
      }
    }
  }
}
