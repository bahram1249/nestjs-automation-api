import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
  ECOrderStatus,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { PersianDate, User } from '@rahino/database';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { GetBasedCourierReportDto } from './dto/get-courier-report.dto';
import { Op, Sequelize } from 'sequelize';
import { OrderShipmentwayEnum, OrderStatusEnum } from '@rahino/ecommerce/shared/enum';

@Injectable()
export class BasedCourierReportService {
  constructor(
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(ECLogisticOrder)
    private readonly orderRepository: typeof ECLogisticOrder,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  private buildVendorExistsClause(vendorId?: number) {
    if (!vendorId) return null;
    const sql = `
      EXISTS (
        SELECT 1
          FROM ECLogisticOrderGroupedDetails GD
         WHERE GD.groupedId = ECLogisticOrderGrouped.id
           AND ISNULL(GD.isDeleted,0)=0
           AND GD.vendorId = ${Number(vendorId)}
      )
    `.replace(/\s\s+/g, ' ');
    return Sequelize.literal(sql);
  }

  async findAll(user: User, filter: GetBasedCourierReportDto) {
    const isValidBeginDate = await this.isValidDate(filter.beginDate);
    if (!isValidBeginDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', { lang: I18nContext.current().lang }),
      );
    }
    const isValidEndDate = await this.isValidDate(filter.endDate);
    if (!isValidEndDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', { lang: I18nContext.current().lang }),
      );
    }

    const vendorExists = this.buildVendorExistsClause(filter.vendorId);

    // Count groups
    let countQB = new QueryOptionsBuilder().include([]);
    countQB = countQB.include([
      { attributes: [], model: ECLogisticOrder, as: 'logisticOrder', required: true } as any,
    ]);
    countQB = countQB
      .filter(
        Sequelize.where(Sequelize.col('logisticOrder.gregorianAtPersian'), { [Op.gte]: filter.beginDate }) as any,
      )
      .filter(
        Sequelize.where(Sequelize.col('logisticOrder.gregorianAtPersian'),
          { [Op.lt]: Sequelize.fn('dateadd', Sequelize.literal('day'), Sequelize.literal('1'), filter.endDate) },
        ) as any,
      )
      .filter(
        Sequelize.where(Sequelize.col('logisticOrder.orderStatusId'), { [Op.ne]: OrderStatusEnum.WaitingForPayment }) as any,
      )
      .filter({ orderShipmentWayId: OrderShipmentwayEnum.delivery })
      .filter({ courierUserId: user.id as any });

    if (filter.orderId)
      countQB = countQB.filter(
        Sequelize.where(Sequelize.col('logisticOrder.id'), { [Op.eq]: filter.orderId }) as any,
      );
    if (vendorExists) countQB = countQB.filter(vendorExists as any);

    const total = await this.groupRepository.count(countQB.build());

    // List groups
    let qb = new QueryOptionsBuilder().include([]);
    qb = qb.include([
      { attributes: ['id'], model: ECLogisticOrder, as: 'logisticOrder', required: true } as any,
    ]);
    qb = qb
      .filter(
        Sequelize.where(Sequelize.col('logisticOrder.gregorianAtPersian'), { [Op.gte]: filter.beginDate }) as any,
      )
      .filter(
        Sequelize.where(Sequelize.col('logisticOrder.gregorianAtPersian'),
          { [Op.lt]: Sequelize.fn('dateadd', Sequelize.literal('day'), Sequelize.literal('1'), filter.endDate) },
        ) as any,
      )
      .filter(
        Sequelize.where(Sequelize.col('logisticOrder.orderStatusId'), { [Op.ne]: OrderStatusEnum.WaitingForPayment }) as any,
      )
      .filter({ orderShipmentWayId: OrderShipmentwayEnum.delivery })
      .filter({ courierUserId: user.id as any });

    if (filter.orderId)
      qb = qb.filter(
        Sequelize.where(Sequelize.col('logisticOrder.id'), { [Op.eq]: filter.orderId }) as any,
      );
    if (!filter.vendorId && vendorExists) qb = qb.filter(vendorExists as any);

    if (filter.vendorId) {
      qb = qb.thenInclude({
        attributes: [],
        model: ECLogisticOrderGroupedDetail,
        as: 'details',
        required: true,
        where: { vendorId: filter.vendorId as any, isDeleted: { [Op.eq]: 0 } as any },
      } as any);

      const vProductSum = 'SUM(isnull(details.productPrice,0)*isnull(details.qty,0))';
      const vDiscountSum = 'SUM(isnull(details.discountFeePerItem,0)*isnull(details.qty,0))';
      const shipShare = `CASE WHEN isnull(ECLogisticOrderGrouped.totalProductPrice,0)=0 THEN 0 ELSE isnull(ECLogisticOrderGrouped.shipmentPrice,0) * ( (${vProductSum}) / isnull(ECLogisticOrderGrouped.totalProductPrice,0) ) END`;
      const realShipShare = `CASE WHEN isnull(ECLogisticOrderGrouped.totalProductPrice,0)=0 THEN 0 ELSE isnull(ECLogisticOrderGrouped.realShipmentPrice,0) * ( (${vProductSum}) / isnull(ECLogisticOrderGrouped.totalProductPrice,0) ) END`;

      qb = qb
        .attributes([
          'id',
          'logisticId',
          'orderShipmentWayId',
          'orderStatusId',
          'courierUserId',
          'postReceipt',
          'deliveryDate',
          'sendToCustomerDate',
          'sendToCustomerBy',
          [Sequelize.fn('isnull', Sequelize.literal(`(${realShipShare})`), 0), 'realShipmentPrice'],
          [Sequelize.fn('isnull', Sequelize.literal(`(${shipShare})`), 0), 'shipmentPrice'],
          [Sequelize.fn('isnull', Sequelize.literal(`((${shipShare}) - (${realShipShare}))`), 0), 'profitAmount'],
          [Sequelize.fn('isnull', Sequelize.literal(`(${vProductSum})`), 0), 'totalProductPrice'],
          [Sequelize.fn('isnull', Sequelize.literal(`(${vDiscountSum})`), 0), 'totalDiscountFee'],
          [Sequelize.fn('isnull', Sequelize.literal(`((${vProductSum}) - (${vDiscountSum}) + (${shipShare}))`), 0), 'totalPrice'],
        ])
        .thenInclude({ attributes: ['id', 'name'], model: ECOrderStatus, as: 'orderStatus', required: false })
        .group([
          'ECLogisticOrderGrouped.id',
          'ECLogisticOrderGrouped.logisticId',
          'ECLogisticOrderGrouped.orderShipmentWayId',
          'ECLogisticOrderGrouped.orderStatusId',
          'ECLogisticOrderGrouped.courierUserId',
          'ECLogisticOrderGrouped.postReceipt',
          'ECLogisticOrderGrouped.deliveryDate',
          'ECLogisticOrderGrouped.sendToCustomerDate',
          'ECLogisticOrderGrouped.sendToCustomerBy',
          'ECLogisticOrderGrouped.totalProductPrice',
          'ECLogisticOrderGrouped.realShipmentPrice',
          'ECLogisticOrderGrouped.shipmentPrice',
          'orderStatus.id',
          'orderStatus.name',
        ])
        .offset(filter.offset)
        .limit(filter.limit);
    } else {
      qb = qb
        .attributes([
          'id',
          'logisticId',
          'orderShipmentWayId',
          'orderStatusId',
          'courierUserId',
          'postReceipt',
          'deliveryDate',
          'sendToCustomerDate',
          'sendToCustomerBy',
          [Sequelize.fn('isnull', Sequelize.col('ECLogisticOrderGrouped.realShipmentPrice'), 0), 'realShipmentPrice'],
          [Sequelize.fn('isnull', Sequelize.col('ECLogisticOrderGrouped.shipmentPrice'), 0), 'shipmentPrice'],
          [
            Sequelize.literal('isnull(ECLogisticOrderGrouped.shipmentPrice, 0) - isnull(ECLogisticOrderGrouped.realShipmentPrice, 0)'),
            'profitAmount',
          ],
          [Sequelize.fn('isnull', Sequelize.col('ECLogisticOrderGrouped.totalProductPrice'), 0), 'totalProductPrice'],
          [Sequelize.fn('isnull', Sequelize.col('ECLogisticOrderGrouped.totalDiscountFee'), 0), 'totalDiscountFee'],
          [Sequelize.fn('isnull', Sequelize.col('ECLogisticOrderGrouped.totalPrice'), 0), 'totalPrice'],
        ])
        .thenInclude({ attributes: ['id', 'name'], model: ECOrderStatus, as: 'orderStatus', required: false })
        .offset(filter.offset)
        .limit(filter.limit);
    }

    const result = await this.groupRepository.findAll(qb.build());
    return { result, total };
  }

  async total(user: User, filter: GetBasedCourierReportDto) {
    const isValidBeginDate = await this.isValidDate(filter.beginDate);
    if (!isValidBeginDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', { lang: I18nContext.current().lang }),
      );
    }
    const isValidEndDate = await this.isValidDate(filter.endDate);
    if (!isValidEndDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', { lang: I18nContext.current().lang }),
      );
    }

    const vendorExists = this.buildVendorExistsClause(filter.vendorId);

    let qb = new QueryOptionsBuilder().include([]);
    qb = qb.include([
      { attributes: [], model: ECLogisticOrder, as: 'logisticOrder', required: true } as any,
    ]);
    qb = qb
      .filter(
        Sequelize.where(Sequelize.col('logisticOrder.gregorianAtPersian'), { [Op.gte]: filter.beginDate }) as any,
      )
      .filter(
        Sequelize.where(Sequelize.col('logisticOrder.gregorianAtPersian'),
          { [Op.lt]: Sequelize.fn('dateadd', Sequelize.literal('day'), Sequelize.literal('1'), filter.endDate) },
        ) as any,
      )
      .filter(
        Sequelize.where(Sequelize.col('logisticOrder.orderStatusId'), { [Op.ne]: OrderStatusEnum.WaitingForPayment }) as any,
      )
      .filter({ orderShipmentWayId: OrderShipmentwayEnum.delivery })
      .filter({ courierUserId: user.id as any });

    if (filter.orderId)
      qb = qb.filter(
        Sequelize.where(Sequelize.col('logisticOrder.id'), { [Op.eq]: filter.orderId }) as any,
      );
    if (!filter.vendorId && vendorExists) qb = qb.filter(vendorExists as any);

    if (filter.vendorId) {
      qb = qb.thenInclude({
        attributes: [],
        model: ECLogisticOrderGroupedDetail,
        as: 'details',
        required: true,
        where: { vendorId: filter.vendorId as any, isDeleted: { [Op.eq]: 0 } as any },
      } as any);

      const vProdTerm = 'isnull(details.productPrice,0)*isnull(details.qty,0)';
      const shipShareSum = `SUM(CASE WHEN isnull(ECLogisticOrderGrouped.totalProductPrice,0)=0 THEN 0 ELSE isnull(ECLogisticOrderGrouped.shipmentPrice,0) * ( (${vProdTerm}) / isnull(ECLogisticOrderGrouped.totalProductPrice,0) ) END)`;
      const realShipShareSum = `SUM(CASE WHEN isnull(ECLogisticOrderGrouped.totalProductPrice,0)=0 THEN 0 ELSE isnull(ECLogisticOrderGrouped.realShipmentPrice,0) * ( (${vProdTerm}) / isnull(ECLogisticOrderGrouped.totalProductPrice,0) ) END)`;

      qb = qb
        .attributes([
          [Sequelize.literal('COUNT(DISTINCT ECLogisticOrderGrouped.id)'), 'cntGroup'],
          [Sequelize.fn('isnull', Sequelize.literal(`${realShipShareSum}`), 0), 'realShipmentPrice'],
          [Sequelize.fn('isnull', Sequelize.literal(`${shipShareSum}`), 0), 'totalShipmentPrice'],
          [Sequelize.fn('isnull', Sequelize.literal(`(${shipShareSum} - ${realShipShareSum})`), 0), 'profitAmount'],
          [Sequelize.fn('isnull', Sequelize.literal('SUM(isnull(details.productPrice,0)*isnull(details.qty,0))'), 0), 'totalProductPrice'],
          [Sequelize.fn('isnull', Sequelize.literal('SUM(isnull(details.discountFeePerItem,0)*isnull(details.qty,0))'), 0), 'totalDiscountFee'],
          [
            Sequelize.fn(
              'isnull',
              Sequelize.literal(`SUM(isnull(details.productPrice,0)*isnull(details.qty,0)) - SUM(isnull(details.discountFeePerItem,0)*isnull(details.qty,0)) + (${shipShareSum})`),
              0,
            ),
            'totalPrice',
          ],
        ]);
    } else {
      qb = qb
        .attributes([
          [Sequelize.fn('count', Sequelize.col('ECLogisticOrderGrouped.id')), 'cntGroup'],
          [Sequelize.fn('isnull', Sequelize.literal('sum(isnull(ECLogisticOrderGrouped.realShipmentPrice, 0))'), 0), 'realShipmentPrice'],
          [Sequelize.fn('isnull', Sequelize.literal('sum(isnull(ECLogisticOrderGrouped.shipmentPrice, 0))'), 0), 'totalShipmentPrice'],
          [
            Sequelize.fn(
              'isnull',
              Sequelize.literal('SUM(isnull(ECLogisticOrderGrouped.shipmentPrice, 0) - isnull(ECLogisticOrderGrouped.realShipmentPrice, 0))'),
              0,
            ),
            'profitAmount',
          ],
          [Sequelize.fn('isnull', Sequelize.literal('sum(isnull(ECLogisticOrderGrouped.totalProductPrice, 0))'), 0), 'totalProductPrice'],
          [Sequelize.fn('isnull', Sequelize.literal('sum(isnull(ECLogisticOrderGrouped.totalDiscountFee, 0))'), 0), 'totalDiscountFee'],
          [Sequelize.fn('isnull', Sequelize.literal('sum(isnull(ECLogisticOrderGrouped.totalPrice, 0))'), 0), 'totalPrice'],
        ]);
    }

    const findOptions = qb.build();
    (findOptions as any).order = null;
    (findOptions as any).offset = null;
    (findOptions as any).limit = null;
    (findOptions as any).raw = true;

    const result = await this.groupRepository.findOne(findOptions);
    return { result };
  }

  private async isValidDate(date: string) {
    const findDate = await this.persianDateRepository.findOne(
      new QueryOptionsBuilder().filter({ GregorianDate: date }).build(),
    );
    if (!findDate) return false;
    return true;
  }
}
