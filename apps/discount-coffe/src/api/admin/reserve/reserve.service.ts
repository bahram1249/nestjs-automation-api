import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { User } from '@rahino/database';
import * as _ from 'lodash';
import { BuffetReserve } from '@rahino/localdatabase/models';
import { BuffetReserveType } from '@rahino/localdatabase/models';
import { Buffet } from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';
import { PersianDate } from '@rahino/database';
import { BuffetReserveDetail } from '@rahino/localdatabase/models';
import { BuffetMenu } from '@rahino/localdatabase/models';
import { ReserveDto, ReserveFilterDto } from './dto';

@Injectable()
export class ReserveService {
  constructor(
    @InjectModel(BuffetReserve)
    private readonly repository: typeof BuffetReserve,
    @InjectModel(BuffetMenu)
    private readonly buffetMenuRepository: typeof BuffetMenu,
    @InjectModel(BuffetReserveDetail)
    private readonly buffetReserveDetailRepository: typeof BuffetReserveDetail,
    @InjectModel(Buffet)
    private readonly buffetRepository: typeof Buffet,
  ) {}

  async findAll(user: User, filter: ReserveFilterDto) {
    let builder = new QueryOptionsBuilder();
    const reserveComplete = 2;
    builder = builder
      .include([
        {
          attributes: [
            'id',
            'firstname',
            'lastname',
            'username',
            'phoneNumber',
          ],
          model: User,
          as: 'user',
        },
        {
          model: Buffet,
          as: 'buffet',
          include: [
            {
              model: Attachment,
              as: 'coverAttachment',
              required: false,
            },
          ],
        },
      ])
      .subQuery(false)
      .filter({ reserveStatusId: reserveComplete })
      .filter({
        '$[user.phoneNumber]$': {
          [Op.like]: filter.search,
        },
      })
      .filter({ '$[buffet.ownerId]$': user.id });
    if (filter.reserveId) {
      builder = builder.filter({ id: filter.reserveId });
    }
    const count = await this.repository.count(builder.build());
    const options = builder
      .include([
        {
          attributes: [
            'id',
            'firstname',
            'lastname',
            'username',
            'phoneNumber',
          ],
          model: User,
          as: 'user',
        },
        {
          model: BuffetReserveType,
          as: 'reserveType',
          required: false,
        },
        {
          attributes: ['id', 'title', 'buffetAddress', 'ownerId'],
          model: Buffet,
          as: 'buffet',
          include: [
            {
              model: Attachment,
              as: 'coverAttachment',
              required: false,
            },
          ],
        },
        {
          model: PersianDate,
          as: 'persianDate',
          on: Sequelize.literal(
            'convert(date, [BuffetReserve].[reserveDate], 103) = [persianDate].[GregorianDate]',
          ),
        },
        {
          model: BuffetReserveDetail,
          as: 'details',
          required: false,
          include: [
            {
              model: BuffetMenu,
              as: 'buffetMenu',
              include: [
                {
                  model: Attachment,
                  as: 'cover',
                  required: false,
                },
              ],
            },
          ],
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();

    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async addOrder(user: User, dto: ReserveDto) {
    const reserve = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.reserveId }).build(),
    );
    if (!reserve) {
      throw new BadRequestException('the item with this given id not founded!');
    }
    const buffet = await this.buffetRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ ownerId: user.id })
        .filter({ id: reserve.buffetId })
        .build(),
    );

    if (!buffet) {
      throw new BadRequestException('the buffet id not founded!');
    }
    if (dto.items.length > 0) {
      const menusIds = dto.items.map((item) => item.id);
      const menus = await this.buffetMenuRepository.findAll({
        where: {
          [Op.and]: [
            {
              id: {
                [Op.in]: menusIds,
              },
            },
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          ],
        },
      });

      for (let index = 0; index < menus.length; index++) {
        const menu = menus[index];
        const item = dto.items.find((item) => item.id == menu.id);

        const count = parseInt(item.count.toString());
        const itemTotalPrice = Number(menu.price) * count;
        await this.buffetReserveDetailRepository.create({
          reserveId: dto.reserveId,
          menuId: menu.id,
          price: menu.price,
          totalPrice: itemTotalPrice,
          countItem: item.count,
        });
      }
      const totalPrice: any = await this.buffetReserveDetailRepository.findOne({
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('totalPrice')), 'totalPrice'],
        ],
        group: ['reserveId'],
        where: {
          reserveId: dto.reserveId,
        },
        order: ['reserveId'],
      });
      await this.repository.update(
        { price: totalPrice.totalPrice },
        {
          where: {
            id: dto.reserveId,
          },
        },
      );
    }
    return {
      result: 'ok',
    };
  }
  async edit(id: bigint, user: User) {
    throw new NotImplementedException();
  }

  async findById(entityId: bigint) {
    throw new NotImplementedException();
  }
}
