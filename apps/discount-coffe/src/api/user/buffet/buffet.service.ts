import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { BuffetCost } from '@rahino/database/models/discount-coffe/buffet-cost.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { CoffeOption } from '@rahino/database/models/discount-coffe/coffe-option.entity';
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
    queryBuilder = queryBuilder.filter(
      Sequelize.where(Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0), {
        [Op.eq]: 0,
      }),
    );
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

    const count = await this.buffetRepository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .attributes([
        'id',
        'title',
        'urlAddress',
        'coverAttachmentId',
        'percentDiscount',
        'buffetAddress',
        'buffetPhone',
        'wazeLink',
        'baladLink',
        'neshanLink',
        'googleMapLink',
        'latitude',
        'longitude',
        'viewCount',
        'buffetTypeId',
        'buffetCostId',
        'cityId',
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
      .order({ orderBy: 'id', sortOrder: 'desc' })
      .limit(dto.limit)
      .offset((dto.page - 1) * dto.limit);

    const buffets = await this.buffetRepository.findAll(queryBuilder.build());
    return {
      result: buffets,
      total: count,
    };
  }
}
