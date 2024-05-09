import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import {
  OrderShipmentwayEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/util/enum';
import { OrderQueryBuilder } from '../utilOrder/service/order-query-builder.service';
import { ListFilter } from '@rahino/query-filter';
import { PostProcessDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { OrderUtilService } from '../utilOrder/service/order-util.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';

@Injectable()
export class PostageOrderService {
  constructor(
    @InjectModel(ECOrder)
    private readonly repository: typeof ECOrder,
    private orderQueryBuilder: OrderQueryBuilder,
    private orderUtilService: OrderUtilService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    let builder = this.orderQueryBuilder;
    builder = builder
      .nonDeletedOrder()
      .orderShipmentWay(OrderShipmentwayEnum.post)
      .addOrderStatus(OrderStatusEnum.OrderHasBeenProcessed)
      .search(filter.search);

    const count = await this.repository.count(builder.build());

    builder = builder
      .subQuery(true)
      .addOrderShipmentWay()
      .addAdminOrderDetails()
      .addAddress()
      .addUser()
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
      .addOrderShipmentWay()
      .orderShipmentWay(OrderShipmentwayEnum.post)
      .addOrderId(id)
      .addOrderStatus(OrderStatusEnum.OrderHasBeenProcessed)
      .addAdminOrderDetails()
      .addAddress()
      .addUser();

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

  async processPost(orderId: bigint, user: User, dto: PostProcessDto) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: orderId })
        .filter({ orderStatusId: OrderStatusEnum.OrderHasBeenProcessed })
        .filter({ orderShipmentWayId: OrderShipmentwayEnum.post })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    item.orderStatusId = OrderStatusEnum.SendByPost;
    item.postReceipt = dto.postReceipt;
    item.deliveryDate = new Date();
    item = await item.save();
    return {
      result: item,
    };
  }
}
