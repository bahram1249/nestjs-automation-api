import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';
import { BuffetMenuCategory } from '@rahino/database/models/discount-coffe/buffet-menu-category.entity';
import { BuffetMenu } from '@rahino/database/models/discount-coffe/buffet-menu.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { CoffeOption } from '@rahino/database/models/discount-coffe/coffe-option.entity';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class BuffetService {
  constructor(
    @InjectModel(Buffet)
    private readonly repository: typeof Buffet,
    @InjectModel(BuffetMenuCategory)
    private readonly buffetMenuCategoryRepository: typeof BuffetMenuCategory,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
  ) {}

  async index(urlAddress: string) {
    const buffet = await this.repository.findOne({
      include: [
        {
          model: Attachment,
          as: 'coverAttachment',
          required: false,
        },
        {
          model: CoffeOption,
          as: 'coffeOptions',
          required: false,
        },
      ],
      where: {
        urlAddress: urlAddress,
      },
    });
    if (!buffet) throw new NotFoundException();
    const viewCount = Number(buffet.viewCount) + 1;
    await this.repository.update(
      {
        viewCount: viewCount,
      },
      {
        where: {
          id: buffet.id,
        },
        silent: true,
      },
    );
    return {
      title: buffet.title,
      layout: 'discountcoffe',
      buffet: buffet.toJSON(),
    };
  }

  async menus(urlAddress: string) {
    const buffet = await this.repository.findOne({
      include: [
        {
          model: Attachment,
          as: 'coverAttachment',
          required: false,
        },
      ],
      where: {
        urlAddress: urlAddress,
      },
    });
    if (!buffet) throw new NotFoundException();
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

    const convertDateFormat = 103;
    const increase = 14;
    const today = await this.persianDateRepository.findOne({
      where: Sequelize.where(Sequelize.col('GregorianDate'), {
        [Op.eq]: Sequelize.fn(
          'convert',
          Sequelize.literal('date'),
          Sequelize.fn('getdate'),
          convertDateFormat,
        ),
      }),
    });
    const endDate = await this.persianDateRepository.findOne({
      where: Sequelize.where(Sequelize.col('GregorianDate'), {
        [Op.eq]: Sequelize.fn(
          'convert',
          Sequelize.literal('date'),
          Sequelize.fn(
            'dateadd',
            Sequelize.literal('day'),
            increase,
            Sequelize.fn('getdate'),
          ),
          convertDateFormat,
        ),
      }),
    });

    return {
      title: 'رزرو از ' + buffet.title,
      layout: 'discountcoffe',
      buffet: buffet.toJSON(),
      buffetMenuCategories: JSON.parse(JSON.stringify(buffetMenuCategories)),
      today: today.toJSON(),
      endDate: endDate.toJSON(),
    };
  }
}
