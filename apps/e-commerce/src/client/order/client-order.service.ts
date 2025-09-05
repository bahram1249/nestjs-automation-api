import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { LogisticOrderQueryBuilder } from '@rahino/ecommerce/client/order-section/utilLogisticOrder/logistic-order-query-builder.service';
import { OrderStatusEnum } from '@rahino/ecommerce/shared/enum';

@Injectable()
export class ClientOrderService {
  constructor(
    @InjectModel(ECLogisticOrder)
    private readonly orderRepo: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupedRepo: typeof ECLogisticOrderGrouped,
    @InjectModel(ECLogisticOrderGroupedDetail)
    private readonly groupedDetailRepo: typeof ECLogisticOrderGroupedDetail,
    private readonly orderQueryBuilder: LogisticOrderQueryBuilder,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  // Keep same shape/signature as UserOrderService
  async findAll(user: User, filter: ListFilter) {
    let builder = this.orderQueryBuilder
      .search(filter.search)
      .addOnlyUser(user.id)
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment);

    const count = await this.orderRepo.count(builder.build());

    builder = builder
      .subQuery(true)
      .includeOrderStatus()
      .includePayment()
      .includeAddress()
      .includeUser()
      .includeGroupsAndDetails()
      .offset(filter.offset)
      .limit(filter.limit)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.orderRepo.findAll(builder.build()),
      total: count,
    };
  }

  async findById(id: bigint, user: User) {
    const builder = this.orderQueryBuilder
      .subQuery(true)
      .addOnlyUser(user.id)
      .addOrderId(id)
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .includeGroupsAndDetails()
      .includeAddress()
      .includeUser()
      .includePayment()
      .includeOrderStatus();

    const result = await this.orderRepo.findOne(builder.build());
    if (!result) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', { lang: I18nContext.current().lang }),
      );
    }
    return { result };
  }
}
