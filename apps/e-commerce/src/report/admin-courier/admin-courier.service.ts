import { BadRequestException, Injectable } from '@nestjs/common';
import { GetAdminCourierDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECOrder } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { PersianDate } from '@rahino/database';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { OrderQueryBuilderService } from '../order-query-builder/order-query-builder.service';
import {
  OrderShipmentwayEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/shared/enum';
import { Sequelize } from 'sequelize';

@Injectable()
export class AdminCourierService {
  constructor(
    @InjectModel(ECOrder)
    private readonly orderRepository: typeof ECOrder,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly shipmentQueryBuilder: OrderQueryBuilderService,
  ) {}

  async findAll(filter: GetAdminCourierDto) {
    const isValidBeginDate = await this.isValidDate(filter.beginDate);
    if (!isValidBeginDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const isValidEndDate = await this.isValidDate(filter.endDate);
    if (!isValidEndDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    let queryBuilder = this.shipmentQueryBuilder
      .init(false)
      //.nonDeleted()
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .addShipmentWay(OrderShipmentwayEnum.delivery)
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate);

    if (filter.courierId) {
      queryBuilder = queryBuilder.addCourier(filter.courierId);
    }
    if (filter.orderId) {
      queryBuilder = queryBuilder.addOrderId(filter.orderId);
    }

    const count = await this.orderRepository.count(queryBuilder.build());
    queryBuilder = queryBuilder
      .attributes([
        'id',
        'orderStatusId',
        'courierUserId',
        'deliveryDate',
        'sendToCustomerDate',
        'postReceipt',
        [
          Sequelize.fn('isnull', Sequelize.col('ECOrder.realShipmentPrice'), 0),
          'realShipmentPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECOrder.totalShipmentPrice'),
            0,
          ),
          'totalShipmentPrice',
        ],
        [
          Sequelize.literal(
            'isnull(ECOrder.totalShipmentPrice, 0) - isnull(ECOrder.realShipmentPrice, 0)',
          ),
          'profitAmount',
        ],
      ])
      .includeCourierUser()
      .includeOrderStatus()
      .offset(filter.offset)
      .limit(filter.limit);

    return {
      result: await this.orderRepository.findAll(queryBuilder.build()),
      total: count,
    };
  }

  async total(filter: GetAdminCourierDto) {
    const isValidBeginDate = await this.isValidDate(filter.beginDate);
    if (!isValidBeginDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const isValidEndDate = await this.isValidDate(filter.endDate);
    if (!isValidEndDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    let queryBuilder = this.shipmentQueryBuilder
      .init(true)
      //.nonDeleted()
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .addShipmentWay(OrderShipmentwayEnum.delivery)
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate);

    if (filter.courierId) {
      queryBuilder = queryBuilder.addCourier(filter.courierId);
    }
    if (filter.orderId) {
      queryBuilder = queryBuilder.addOrderId(filter.orderId);
    }

    queryBuilder = queryBuilder
      .attributes([
        [Sequelize.fn('count', Sequelize.col('ECOrder.id')), 'cntOrder'],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal('sum(isnull(ECOrder.realShipmentPrice, 0))'),
            0,
          ),
          'realShipmentPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal('sum(isnull(ECOrder.totalShipmentPrice, 0))'),
            0,
          ),
          'totalShipmentPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal(
              'SUM(isnull(ECOrder.totalShipmentPrice, 0) - isnull(ECOrder.realShipmentPrice, 0))',
            ),
            0,
          ),
          'profitAmount',
        ],
      ])
      .rawQuery(true);

    const findOptions = queryBuilder.build();
    findOptions.order = null;
    findOptions.offset = null;
    findOptions.limit = null;

    return {
      result: await this.orderRepository.findOne(findOptions),
    };
  }

  async isValidDate(date: string) {
    const findDate = await this.persianDateRepository.findOne(
      new QueryOptionsBuilder().filter({ GregorianDate: date }).build(),
    );
    if (!findDate) return false;
    return true;
  }
}
