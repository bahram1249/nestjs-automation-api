import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { OrderQueryBuilder } from '@rahino/ecommerce/admin/utilOrder/service/order-query-builder.service';
import { OrderStatusEnum } from '@rahino/ecommerce/util/enum';
import { ListFilter } from '@rahino/query-filter';

@Injectable()
export class UserOrderService {
  constructor(
    @InjectModel(ECOrder) private readonly repository: typeof ECOrder,
    private readonly orderQueryBuilder: OrderQueryBuilder,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    let builder = this.orderQueryBuilder
      .nonDeletedOrder()
      .search(filter.search)
      .addOnlyUser(user.id)
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment);

    const count = await this.repository.count(builder.build());

    builder = builder
      .subQuery(true)
      .addUserOrderDetails()
      .addOrderShipmentWay()
      .addAddress()
      .addUser()
      .offset(filter.offset)
      .limit(filter.limit)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.repository.findAll(builder.build()),
      total: count,
    };
  }

  async findById(id: bigint, user: User) {
    const builder = this.orderQueryBuilder
      .subQuery(true)
      .nonDeletedOrder()
      .addOnlyUser(user.id)
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .addUserOrderDetails()
      .addOrderShipmentWay()
      .addAddress()
      .addUser();

    const result = await this.repository.findOne(builder.build());
    if (!result) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: result,
    };
  }
}
