import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECPayment } from '@rahino/localdatabase/models/ecommerce-eav/ec-payment-entity';
import { ECLogisticOrder } from '@rahino/localdatabase/models/ecommerce-eav/ec-logistic-order.entity';
import { ECLogisticOrderGrouped } from '@rahino/localdatabase/models/ecommerce-eav/ec-logistic-order-grouped.entity';
import { ECLogisticOrderGroupedDetail } from '@rahino/localdatabase/models/ecommerce-eav/ec-logistic-order-grouped-detail.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { SMS_SERVICE } from '@rahino/sms/contants';
import { SmsService } from '@rahino/sms/sms.service';
import { Op, Sequelize, Transaction } from 'sequelize';
import * as moment from 'moment-jalaali';
import { ECVendor, ECVendorUser } from '@rahino/localdatabase/models';

@Injectable()
export class LogisticEcommerceSmsService {
  constructor(
    @Inject(SMS_SERVICE)
    private readonly smsService: SmsService,
    private readonly config: ConfigService,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECLogisticOrder)
    private readonly logisticOrderRepository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupedRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(ECLogisticOrderGroupedDetail)
    private readonly groupedDetailRepository: typeof ECLogisticOrderGroupedDetail,
    @InjectModel(ECVendor)
    private readonly vendorRepository: typeof ECVendor,
  ) {}

  async successfulPayment(text: string, to: string) {
    const activeSms =
      (await this.config.get(
        'ECOMMERCE_SUSSESSFUL_PAYMENT_SMS_CODE_STATUS',
      )) === 'true';
    if (activeSms) {
      const body = this.config.get('ECOMMERCE_SUSSESSFUL_PAYMENT_SMS_CODE');
      await this.smsService.sendMessage({ text, to, bodyId: body });
    }
  }

  async sendByCourier(text: string, to: string) {
    // {0} {1} عزیز، سفارش شما توسط {2} با کدپیگیری {3} با موفقیت ارسال شد
    const activeSms =
      (await this.config.get('ECOMMERCE_COURIER_SEND_SMS_CODE_STATUS')) ===
      'true';
    if (activeSms) {
      const body = this.config.get('ECOMMERCE_COURIER_SEND_SMS_CODE');
      await this.smsService.sendMessage({ text, to, bodyId: body });
    }
  }

  async sendByPost(text: string, to: string) {
    // {0} {1} عزیز، سفارش شما توسط {2} با کدپیگیری {3} با موفقیت ارسال شد
    const activeSms =
      (await this.config.get('ECOMMERCE_POST_SEND_SMS_CODE_STATUS')) === 'true';
    if (activeSms) {
      const body = this.config.get('ECOMMERCE_POST_SEND_SMS_CODE');
      await this.smsService.sendMessage({ text, to, bodyId: body });
    }
  }

  async successfulOrderToVendor(paymentId: bigint, transaction?: Transaction) {
    const activeSms =
      (await this.config.get('ECOMMERCE_SUSSESSFUL_ORDER_SMS_STATUS')) ===
      'true';
    if (!activeSms) return;

    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: paymentId })
        .transaction(transaction)
        .build(),
    );

    if (!payment?.logisticOrderId) return;

    // Collect vendorIds from logistic grouped details of this logistic order
    const grouped = await this.groupedRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ logisticOrderId: payment.logisticOrderId })
        .build(),
    );
    if (!grouped.length) return;

    const groupedIds = grouped.map((g) => g.id as any);

    const details = await this.groupedDetailRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ groupedId: { [Op.in]: groupedIds } })
        .build(),
    );

    const vendorIds = Array.from(
      new Set<number>(details.map((d) => Number(d.vendorId))),
    );
    if (!vendorIds.length) return;

    const vendors = await this.vendorRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ id: { [Op.in]: vendorIds } })
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
                { isDefault: true },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('vendorUser.isDeleted'),
                    0,
                  ),
                  { [Op.eq]: 0 },
                ),
              ],
            },
          },
        ])
        .build(),
    );

    const body = this.config.get('ECOMMERCE_SUSSESSFUL_ORDER_SMS_CODE');
    for (const vendor of vendors) {
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
