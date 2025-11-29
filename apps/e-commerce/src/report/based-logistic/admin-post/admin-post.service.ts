import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PersianDate } from '@rahino/database';
import { ECLogisticOrderGrouped } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { LogisticOrderQueryBuilderService } from '../order-query-builder/logistic-order-query-builder.service';
import { GetAdminPostDto } from '../../admin-post/dto';
import {
  OrderShipmentwayEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/shared/enum';
import { Sequelize } from 'sequelize';

@Injectable()
export class BasedAdminPostService {
  constructor(
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupedRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly orderQueryBuilder: LogisticOrderQueryBuilderService,
  ) {}

  async findAll(filter: GetAdminPostDto) {
    await this.validateDates(filter.beginDate, filter.endDate);

    let qb = this.orderQueryBuilder
      .init(false)
      .nonDeletedGroup()
      .nonDeletedOrder()
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .addShipmentWay(OrderShipmentwayEnum.post)
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate);

    if (filter.orderId) {
      qb = qb.addOrderId(filter.orderId);
    }

    const count = await this.groupedRepository.count(qb.build());

    qb = qb
      .attributes([
        'id',
        'orderStatusId',
        'courierUserId',
        'deliveryDate',
        'sendToCustomerDate',
        'postReceipt',
        [
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECLogisticOrderGrouped.realShipmentPrice'),
            0,
          ),
          'realShipmentPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECLogisticOrderGrouped.shipmentPrice'),
            0,
          ),
          'totalShipmentPrice',
        ],
        [
          Sequelize.literal(
            'isnull(ECLogisticOrderGrouped.shipmentPrice, 0) - isnull(ECLogisticOrderGrouped.realShipmentPrice, 0)',
          ),
          'profitAmount',
        ],
      ])
      .includeOrderStatus()
      .offset(filter.offset)
      .limit(filter.limit);

    const result = await this.groupedRepository.findAll(qb.build());
    return { result, total: count };
  }

  async total(filter: GetAdminPostDto) {
    await this.validateDates(filter.beginDate, filter.endDate);

    let qb = this.orderQueryBuilder
      .init(true)
      .nonDeletedGroup()
      .nonDeletedOrder()
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .addShipmentWay(OrderShipmentwayEnum.post)
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate);

    if (filter.orderId) {
      qb = qb.addOrderId(filter.orderId);
    }

    qb = qb
      .attributes([
        [
          Sequelize.fn('count', Sequelize.col('ECLogisticOrderGrouped.id')),
          'cntOrder',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.col('ECLogisticOrderGrouped.realShipmentPrice'),
            ),
            0,
          ),
          'realShipmentPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.col('ECLogisticOrderGrouped.shipmentPrice'),
            ),
            0,
          ),
          'totalShipmentPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal(
              'SUM(isnull(ECLogisticOrderGrouped.shipmentPrice, 0) - isnull(ECLogisticOrderGrouped.realShipmentPrice, 0))',
            ),
            0,
          ),
          'profitAmount',
        ],
      ])
      .rawQuery(true);

    const findOptions = qb.build();
    findOptions.order = null as any;
    findOptions.offset = null as any;
    findOptions.limit = null as any;

    const result = await this.groupedRepository.findOne(findOptions);
    return { result };
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
