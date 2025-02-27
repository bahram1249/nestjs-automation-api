import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database';
import { BuffetCost } from '@rahino/localdatabase/models';
import { BuffetReserve } from '@rahino/localdatabase/models';
import { BuffetType } from '@rahino/localdatabase/models';
import { Buffet } from '@rahino/localdatabase/models';
import { BuffetCity } from '@rahino/localdatabase/models';
import { CoffeOption } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Request } from 'express';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Buffet)
    private readonly buffetRepository: typeof Buffet,
    @InjectModel(BuffetType)
    private readonly buffetTypesRepository: typeof BuffetType,
    @InjectModel(BuffetCity)
    private readonly buffetCityRepository: typeof BuffetCity,
    @InjectModel(BuffetReserve)
    private readonly buffetReserveRepository: typeof BuffetReserve,
    @InjectModel(BuffetCost)
    private readonly buffetCostRepository: typeof BuffetCost,
  ) {}
  async index(req: Request) {
    const coffe = 1;
    const resturant = 2;
    const luxuryCoffeId = 3;
    const lowPriceCoffe = 1;
    const reserveComplete = 2;

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
            Sequelize.fn('isnull', Sequelize.col('Buffet.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        ],
      },
      order: [['id', 'desc']],
      limit: 10,
    });
    const lastResuturants = await this.buffetRepository.findAll({
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
            buffetTypeId: resturant,
          },
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('Buffet.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        ],
      },
      order: [['id', 'desc']],
      limit: 10,
    });

    const luxuryCoffes = await this.buffetRepository.findAll({
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
            buffetCostId: luxuryCoffeId,
          },
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('Buffet.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        ],
      },
      order: [['id', 'desc']],
      limit: 10,
    });

    const lowPrices = await this.buffetRepository.findAll({
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
            buffetCostId: lowPriceCoffe,
          },
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('Buffet.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        ],
      },
      order: [['id', 'desc']],
      limit: 10,
    });

    const pinedBuffets = await this.buffetRepository.findAll({
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
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('Buffet.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('Buffet.pin'), 0),
            {
              [Op.eq]: 1,
            },
          ),
        ],
      },
      order: [['id', 'desc']],
    });

    const buffetTypes = await this.buffetTypesRepository.findAll({
      attributes: ['id', 'title'],
    });
    const buffetCities = await this.buffetCityRepository.findAll({
      attributes: ['id', 'title'],
    });

    const buffetCosts = await this.buffetCostRepository.findAll({
      attributes: ['id', 'title'],
    });

    const resturantCount = await this.buffetRepository.count({
      where: {
        [Op.and]: [
          {
            buffetTypeId: resturant,
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

    const coffeCount = await this.buffetRepository.count({
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
    });
    const reserveCount = await this.buffetReserveRepository.count(
      new QueryOptionsBuilder()
        .filter({ reserveStatusId: reserveComplete })
        .build(),
    );

    return {
      title: 'تخفیف کافه',
      layout: 'discountcoffe',
      lastCoffes: JSON.parse(JSON.stringify(lastCoffes)),
      lastResuturants: JSON.parse(JSON.stringify(lastResuturants)),
      luxuryCoffes: JSON.parse(JSON.stringify(luxuryCoffes)),
      lowPrices: JSON.parse(JSON.stringify(lowPrices)),
      pinedBuffets: JSON.parse(JSON.stringify(pinedBuffets)),
      buffetTypes: JSON.parse(JSON.stringify(buffetTypes)),
      buffetCities: JSON.parse(JSON.stringify(buffetCities)),
      buffetCosts: JSON.parse(JSON.stringify(buffetCosts)),
      resturantCount: resturantCount,
      coffeCount: coffeCount,
      reserveCount: reserveCount,
      user: req.user,
    };
  }

  async contactus(req: Request) {
    return {
      title: 'تماس با ما',
      layout: 'discountcoffe',
    };
  }
  async aboutus(req: Request) {
    return {
      title: 'درباره ما',
      layout: 'discountcoffe',
    };
  }
}
