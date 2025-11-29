import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECLogisticOrder } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { PersianDate } from '@rahino/database';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { Sequelize } from 'sequelize';
import { GetPaymentTransactionDto } from './dto/get-payment-transaction.dto';
import { LogisticPaymentQueryBuilderService } from '../payment-query-builder/logistic-payment-query-builder.service';

@Injectable()
export class BasedPaymentTransactionService {
  constructor(
    @InjectModel(ECLogisticOrder)
    private readonly orderRepository: typeof ECLogisticOrder,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly paymentQueryBuilder: LogisticPaymentQueryBuilderService,
  ) {}

  async findAll(filter: GetPaymentTransactionDto) {
    await this.validateDates(filter.beginDate, filter.endDate);

    let qb = this.paymentQueryBuilder
      .init(false)
      .nonDeleted()
      .onlyPaid()
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate)
      .includePayment();

    if (filter.paymentGatewayId) {
      qb = qb.addPaymentGatewayId(filter.paymentGatewayId);
    }
    if (filter.orderId) {
      qb = qb.addOrderId(filter.orderId);
    }

    const count = await this.orderRepository.count(qb.build());

    qb = qb
      .attributes([
        'id',
        [
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECLogisticOrder.shipmentPrice'),
            0,
          ),
          'realShipmentPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECLogisticOrder.discountFee'),
            0,
          ),
          'totalDiscountFee',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECLogisticOrder.totalPrice'),
            0,
          ),
          'totalPrice',
        ],
        [
          Sequelize.fn('isnull', Sequelize.col('payment.commissionAmount'), 0),
          'paymentCommissionAmount',
        ],
        [
          Sequelize.literal(
            'isnull(ECLogisticOrder.totalPrice, 0) - isnull(payment.commissionAmount, 0)',
          ),
          'receivedAmount',
        ],
        'createdAt',
      ])
      .offset(filter.offset)
      .limit(filter.limit)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.orderRepository.findAll(qb.build()),
      total: count,
    };
  }

  async total(filter: GetPaymentTransactionDto) {
    await this.validateDates(filter.beginDate, filter.endDate);

    let qb = this.paymentQueryBuilder
      .init(true)
      .nonDeleted()
      .onlyPaid()
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate)
      .includePayment();

    if (filter.paymentGatewayId) {
      qb = qb.addPaymentGatewayId(filter.paymentGatewayId);
    }
    if (filter.orderId) {
      qb = qb.addOrderId(filter.orderId);
    }

    qb = qb
      .attributes([
        [
          Sequelize.fn('count', Sequelize.col('ECLogisticOrder.id')),
          'cntOrder',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal('sum(isnull(ECLogisticOrder.shipmentPrice, 0))'),
            0,
          ),
          'realShipmentPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal('sum(isnull(ECLogisticOrder.discountFee, 0))'),
            0,
          ),
          'totalDiscountFee',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal('sum(isnull(ECLogisticOrder.totalPrice, 0))'),
            0,
          ),
          'totalPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal('sum(isnull(payment.commissionAmount, 0))'),
            0,
          ),
          'paymentCommissionAmount',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal(
              'SUM(isnull(ECLogisticOrder.totalPrice, 0) - isnull(payment.commissionAmount, 0))',
            ),
            0,
          ),
          'receivedAmount',
        ],
      ])
      .rawQuery(true);

    const findOptions = qb.build();
    findOptions.order = null;
    findOptions.offset = null;
    findOptions.limit = null;

    return {
      result: await this.orderRepository.findOne(findOptions),
    };
  }

  private async validateDates(beginDate: string, endDate: string) {
    const isValidBeginDate = await this.isValidDate(beginDate);
    if (!isValidBeginDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const isValidEndDate = await this.isValidDate(endDate);
    if (!isValidEndDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }
  }

  private async isValidDate(date: string) {
    const findDate = await this.persianDateRepository.findOne(
      new QueryOptionsBuilder().filter({ GregorianDate: date }).build(),
    );
    return !!findDate;
  }
}
