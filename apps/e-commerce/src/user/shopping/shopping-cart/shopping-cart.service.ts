import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ECShoppingCart,
  ECShoppingCartProduct,
  ECUserSession,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ECShoppingCart)
    private readonly shoppingCartRepository: typeof ECShoppingCart,
  ) {}
  async findAll(session: ECUserSession) {
    const shoppingCarts = await this.shoppingCartRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ sessionId: session.id })
        .include([
          {
            model: ECShoppingCartProduct,
            as: 'shoppingCartProducts',
            where: {
              isDeleted: true,
            },
            required: true,
          },
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECShoppingCart.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
  }
}
