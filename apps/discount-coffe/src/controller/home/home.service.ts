import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { BuffetCost } from '@rahino/database/models/discount-coffe/buffet-cost.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { CoffeOption } from '@rahino/database/models/discount-coffe/coffe-option.entity';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Buffet)
    private readonly buffetRepository: typeof Buffet,
  ) {}
  async index() {
    const coffe = 1;
    const resturant = 2;
    const lastCoffes = await this.buffetRepository.findAll({
      include: [
        {
          model: Attachment,
          as: 'coverAttachment',
        },
        {
          model: BuffetCost,
          as: 'buffetCost',
          required: false,
        },
        {
          model: CoffeOption,
          as: 'coffeOptions',
          required: false,
        },
      ],
      where: {
        [Op.and]: [
          {
            buffetTypeId: coffe,
          },
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        ],
      },
      order: [['id', 'desc']],
      limit: 10,
    });

    return {
      title: 'تخفیف کافه',
      layout: 'discountcoffe',
      lastCoffes: JSON.parse(JSON.stringify(lastCoffes)),
    };
  }
}
