import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import { ECProductComment } from '@rahino/localdatabase/models';
import { ECWallet } from '@rahino/localdatabase/models';
import {
  OrderStatusEnum,
  ProductCommentStatusEnum,
} from '@rahino/ecommerce/shared/enum';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(ECProductComment)
    private readonly productCommentRepository: typeof ECProductComment,
    @InjectModel(ECOrder)
    private readonly orderRepository: typeof ECOrder,
    @InjectModel(ECWallet)
    private readonly walletRepository: typeof ECWallet,
  ) {}

  async totalComments(user: User) {
    const count = await this.productCommentRepository.count(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ statusId: ProductCommentStatusEnum.confirm })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECProductComment.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    return {
      result: count,
    };
  }

  async totalOrders(user: User) {
    const count = await this.orderRepository.count(
      new QueryOptionsBuilder()
        .filter({
          orderStatusId: {
            [Op.ne]: OrderStatusEnum.WaitingForPayment,
          },
        })
        .filter({ userId: user.id })
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
    return {
      result: count,
    };
  }

  async totalWalletAmounts(user: User) {
    const wallet = await this.walletRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECWallet.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    return {
      result: wallet.currentAmount,
    };
  }
}
