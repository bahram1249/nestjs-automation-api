import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import {
  OrderShipmentwayEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/shared/enum';
import { OrderQueryBuilder } from '../utilOrder/service/order-query-builder.service';
import { ListFilter } from '@rahino/query-filter';
import { CourierProcessDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { OrderUtilService } from '../utilOrder/service/order-util.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { ECCourier } from '@rahino/localdatabase/models';
import { ECommmerceSmsService } from '@rahino/ecommerce/shared/sms/ecommerce-sms.service';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';

@Injectable()
export class CourierOrderService {
  constructor(
    @InjectModel(ECOrder)
    private readonly repository: typeof ECOrder,
    @InjectModel(ECCourier)
    private readonly courierRepository: typeof ECCourier,
    private orderQueryBuilder: OrderQueryBuilder,
    private orderUtilService: OrderUtilService,
    private readonly userVendorService: UserVendorService,
    private readonly smsService: ECommmerceSmsService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    let builder = this.orderQueryBuilder;
    builder = builder
      .nonDeletedOrder()
      .orderShipmentWay(OrderShipmentwayEnum.delivery)
      .addOrderStatus(OrderStatusEnum.OrderHasBeenProcessed)
      .search(filter.search);

    const count = await this.repository.count(builder.build());

    builder = builder
      .subQuery(true)
      .includeOrderShipmentWay()
      .includeAdminOrderDetails()
      .includeAddress()
      .includeUser()
      .offset(filter.offset)
      .limit(filter.limit)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    let result = await this.repository.findAll(builder.build());
    result = await this.orderUtilService.recalculateOrdersPrices(result);

    return {
      result: result,
      total: count,
    };
  }

  async findAllV2(user: User, filter: ListFilter) {
    const vendorIds = await this.userVendorService.findVendorIds(user);

    let builder = this.orderQueryBuilder;
    builder = builder
      .nonDeletedOrder()
      .orderShipmentWay(OrderShipmentwayEnum.delivery)
      .addOrderStatus(OrderStatusEnum.OrderHasBeenProcessed)
      .addOnlyVendor(vendorIds)
      .search(filter.search);

    const count = await this.repository.count(builder.build());

    builder = builder
      .subQuery(true)
      .includeOrderShipmentWay()
      .includeAdminOrderDetails()
      .includeAddress()
      .includeUser()
      .offset(filter.offset)
      .limit(filter.limit)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    let result = await this.repository.findAll(builder.build());
    result = await this.orderUtilService.recalculateOrdersPrices(result);

    return {
      result: result,
      total: count,
    };
  }

  async findById(id: bigint, user: User) {
    let builder = this.orderQueryBuilder;

    builder = builder
      .nonDeletedOrder()
      .includeOrderShipmentWay()
      .orderShipmentWay(OrderShipmentwayEnum.delivery)
      .addOrderId(id)
      .addOrderStatus(OrderStatusEnum.OrderHasBeenProcessed)
      .includeAdminOrderDetails()
      .includeAddress()
      .includeUser();

    let result = await this.repository.findOne(builder.build());
    if (!result) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    result = await this.orderUtilService.recalculateOrderPrices(result);

    return {
      result: result,
    };
  }

  async findByIdV2(id: bigint, user: User) {
    const vendorIds = await this.userVendorService.findVendorIds(user);

    let builder = this.orderQueryBuilder;

    builder = builder
      .nonDeletedOrder()
      .includeOrderShipmentWay()
      .orderShipmentWay(OrderShipmentwayEnum.delivery)
      .addOrderId(id)
      .addOrderStatus(OrderStatusEnum.OrderHasBeenProcessed)
      .addOnlyVendor(vendorIds)
      .includeAdminOrderDetails()
      .includeAddress()
      .includeUser();

    let result = await this.repository.findOne(builder.build());
    if (!result) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    result = await this.orderUtilService.recalculateOrderPrices(result);

    return {
      result: result,
    };
  }

  async processCourier(orderId: bigint, user: User, dto: CourierProcessDto) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: orderId })
        .filter({ orderStatusId: OrderStatusEnum.OrderHasBeenProcessed })
        .filter({ orderShipmentWayId: OrderShipmentwayEnum.delivery })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            model: User,
            as: 'user',
          },
        ])
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const courier = await this.courierRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: dto.userId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECCourier.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            model: User,
            as: 'user',
          },
        ])
        .build(),
    );
    if (!courier) {
      throw new NotFoundException(
        this.i18n.t('ecommerce.courier_not_found', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    item.orderStatusId = OrderStatusEnum.SendByCourier;
    item.deliveryDate = new Date();
    item.courierUserId = dto.userId;

    item = await item.save();
    await this.smsService.sendByCourier(
      `${item.user.firstname};${item.user.lastname};${courier.user.phoneNumber};${orderId}`,
      item.user.phoneNumber,
    );

    return {
      result: item,
    };
  }

  async processCourierV2(orderId: bigint, user: User, dto: CourierProcessDto) {
    const vendorIds = await this.userVendorService.findVendorIds(user);

    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: orderId })
        .filter({ orderStatusId: OrderStatusEnum.OrderHasBeenProcessed })
        .filter({ orderShipmentWayId: OrderShipmentwayEnum.delivery })
        .filter(
          Sequelize.literal(
            `EXISTS (
            SELECT 1
            FROM ECOrderDetails EOD
            WHERE EOD.orderId = ECOrder.id AND EOD.vendorId IN (${vendorIds.toString()})
          )`.replaceAll(/\s\s+/g, ' '),
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            model: User,
            as: 'user',
          },
        ])
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const courier = await this.courierRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: dto.userId })
        .filter({
          vendorId: {
            [Op.in]: vendorIds,
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECCourier.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            model: User,
            as: 'user',
          },
        ])
        .build(),
    );
    if (!courier) {
      throw new NotFoundException(
        this.i18n.t('ecommerce.courier_not_found', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    item.orderStatusId = OrderStatusEnum.SendByCourier;
    item.deliveryDate = new Date();
    item.courierUserId = dto.userId;

    item = await item.save();
    await this.smsService.sendByCourier(
      `${item.user.firstname};${item.user.lastname};${courier.user.phoneNumber};${orderId}`,
      item.user.phoneNumber,
    );

    return {
      result: item,
    };
  }
}
