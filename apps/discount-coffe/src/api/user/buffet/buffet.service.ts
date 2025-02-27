import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database';
import { BuffetCost } from '@rahino/localdatabase/models';
import { Buffet } from '@rahino/localdatabase/models';
import { CoffeOption } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { BuffetFilterDto } from './dto';

@Injectable()
export class BuffetService {
  constructor(
    @InjectModel(Buffet)
    private readonly buffetRepository: typeof Buffet,
  ) {}

  async findAll(dto: BuffetFilterDto) {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder
      .filter(
        Sequelize.where(Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0), {
          [Op.eq]: 0,
        }),
      )
      .filter({
        title: {
          [Op.like]: dto.search,
        },
      });
    if (dto.buffetTypeId) {
      queryBuilder = queryBuilder.filter({
        buffetTypeId: dto.buffetTypeId,
      });
    }
    if (dto.buffetCostId) {
      queryBuilder = queryBuilder.filter({
        buffetCostId: dto.buffetCostId,
      });
    }

    if (dto.buffetCityId) {
      queryBuilder = queryBuilder.filter({
        cityId: dto.buffetCityId,
      });
    }

    if (dto.coffeOptionIds.length > 0) {
      dto.coffeOptionIds.forEach((coffeOption) => {
        queryBuilder = queryBuilder.filter(
          Sequelize.literal(`
            EXISTS (
              SELECT 1
              FROM DiscountCoffeBuffetOptions DCBO
              WHERE DCBO.buffetId = Buffet.id
                AND DCBO.optionId = ${coffeOption}
            )
          `),
        );
      });
    }

    if (dto.latitude) {
      queryBuilder = queryBuilder.filter(
        Sequelize.literal(`
            dbo.fnCalcDistanceKM(Buffet.latitude, ${dto.latitude},Buffet.longitude, ${dto.longitude}) < 50
          `),
      );
    }

    const count = await this.buffetRepository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .attributes([
        'id',
        'title',
        'urlAddress',
        'percentDiscount',
        'buffetAddress',
        'buffetPhone',
        // 'wazeLink',
        // 'baladLink',
        // 'neshanLink',
        // 'googleMapLink',
        // 'latitude',
        // 'longitude',
        // 'viewCount',
        // 'buffetTypeId',
        // 'buffetCostId',
        // 'cityId',
      ])
      .include([
        {
          attributes: ['id', 'originalFileName', 'fileName', 'ext', 'mimetype'],
          model: Attachment,
          as: 'coverAttachment',
        },
        {
          attributes: ['id', 'title'],
          model: BuffetCost,
          as: 'buffetCost',
          required: false,
        },
        {
          attributes: ['id', 'title', 'iconClass'],
          model: CoffeOption,
          as: 'coffeOptions',
          required: false,
        },
      ])
      .order({ orderBy: dto.orderBy, sortOrder: dto.order })
      .limit(dto.limit)
      .offset((dto.page - 1) * dto.limit);

    const buffets = await this.buffetRepository.findAll(queryBuilder.build());
    return {
      result: buffets,
      total: count,
    };
  }
}
