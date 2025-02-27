import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuffetReserve } from '@rahino/localdatabase/models';
import { OrderDto } from './dto';
import { Request } from 'express';
import { User } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Buffet } from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';
import { Op, Sequelize } from 'sequelize';
import { BuffetMenu } from '@rahino/localdatabase/models';
import { BuffetMenuCategory } from '@rahino/localdatabase/models';

@Injectable()
export class ReserveService {
  constructor(
    @InjectModel(BuffetReserve)
    private readonly repository: typeof BuffetReserve,
    @InjectModel(Buffet)
    private readonly buffetRepository: typeof Buffet,
    @InjectModel(BuffetMenuCategory)
    private readonly buffetMenuCategoryRepository: typeof BuffetMenuCategory,
  ) {}
  async addOrder(req: Request, user: User, query: OrderDto) {
    const reserve = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: query.reserveId })
        .filter({ buffetId: query.buffetId })
        .build(),
    );
    if (!reserve) {
      throw new ForbiddenException('cannot access');
    }
    const buffet = await this.buffetRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: query.buffetId })
        .filter({ ownerId: user.id })
        .build(),
    );
    if (!buffet) {
      throw new ForbiddenException('cannot access');
    }

    const buffetMenuCategories =
      await this.buffetMenuCategoryRepository.findAll({
        include: [
          {
            include: [
              {
                model: Attachment,
                as: 'cover',
                required: false,
              },
            ],
            model: BuffetMenu,
            as: 'menus',
            required: true,
            where: {
              [Op.and]: [
                {
                  buffetId: buffet.id,
                },
                Sequelize.where(
                  Sequelize.fn('isnull', Sequelize.col('menus.isDeleted'), 0),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
          },
          {
            model: Attachment,
            as: 'cover',
            required: false,
          },
        ],
      });

    return {
      title: 'افزودن سفارش',
      sitename: req.sitename,
      reserveId: query.reserveId,
      buffetId: query.buffetId,
      layout: 'empty',
      buffetMenuCategories: JSON.parse(JSON.stringify(buffetMenuCategories)),
    };
  }
}
