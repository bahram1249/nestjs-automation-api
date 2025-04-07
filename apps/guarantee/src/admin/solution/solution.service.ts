import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetSolutionDto, SolutionDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { GSProvince, GSSolution } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';
import { ChildSolutionDto } from './dto/child-solution.dto';

@Injectable()
export class SolutionService {
  constructor(
    @InjectModel(GSSolution)
    private readonly repository: typeof GSSolution,
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: GetSolutionDto) {
    let query = new QueryOptionsBuilder()
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSSolution.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'title', 'fee', 'createdAt', 'updatedAt'])
      .include([
        {
          attributes: ['id', 'fee', 'provinceId'],
          model: GSSolution,
          as: 'provinceSolutions',
          include: [
            {
              attributes: ['id', 'name'],
              model: GSProvince,
              as: 'province',
            },
          ],
          required: false,
        },
      ])
      .filter({
        parentId: {
          [Op.is]: null,
        },
      })
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }

  async findById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'title', 'fee', 'createdAt', 'updatedAt'])
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSSolution.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            attributes: ['id', 'fee', 'provinceId'],
            model: GSSolution,
            as: 'provinceSolutions',
            include: [
              {
                attributes: ['id', 'name'],
                model: GSProvince,
                as: 'province',
              },
            ],
            required: false,
          },
        ])
        .filter({
          parentId: {
            [Op.is]: null,
          },
        })
        .filter({ id: entityId })
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    return {
      result: item,
    };
  }

  async create(dto: SolutionDto) {
    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSSolution.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ title: dto.title })
        .build(),
    );
    if (duplicateItem) {
      throw new BadRequestException(
        this.i18n.t('core.item_exists', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let insertedId: number;

    try {
      const mappedItem = this.mapper.map(dto, SolutionDto, GSSolution);
      const insertedItem = _.omit(mappedItem.toJSON(), ['id']);
      insertedItem.unitPriceId = GSUnitPriceEnum.Toman;

      const result = await this.repository.create(insertedItem);
      insertedId = result.id;
      await this.createProvinceSolutions(
        result.id,
        dto.provinceSolutions,
        transaction,
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }

    return await this.findById(insertedId);
  }

  async updateById(id: number, dto: SolutionDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSSolution.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!item) {
      throw new BadRequestException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSSolution.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ title: dto.title })
        .filter({
          id: {
            [Op.ne]: id,
          },
        })
        .build(),
    );
    if (duplicateItem) {
      throw new BadRequestException(
        this.i18n.t('core.item_exists', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      const mappedItem = this.mapper.map(dto, SolutionDto, GSSolution);
      const updatedItem = _.omit(mappedItem.toJSON(), ['id']);
      updatedItem.unitPriceId = GSUnitPriceEnum.Toman;
      await this.repository.update(updatedItem, {
        where: {
          id: id,
        },
      });

      await this.createOrUpdateProvinceSolutions(
        id,
        dto.provinceSolutions,
        transaction,
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
    }

    return await this.findById(id);
  }

  async deleteById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSSolution.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new BadRequestException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    item.isDeleted = true;
    await item.save();
    return {
      result: _.pick(item, ['id', 'title', 'fee', 'createdAt', 'updatedAt']),
    };
  }

  private async createProvinceSolutions(
    solutionId: number,
    solutionProvinces?: ChildSolutionDto[],
    transaction?: Transaction,
  ) {
    for (const solutionProvince of solutionProvinces) {
      await this.createProvinceSolution(
        solutionId,
        solutionProvince,
        transaction,
      );
    }
  }

  private async createProvinceSolution(
    solutionId: number,
    solutionProvince: ChildSolutionDto,
    transaction?: Transaction,
  ) {
    const mappedItem = this.mapper.map(
      solutionProvince,
      ChildSolutionDto,
      GSSolution,
    );
    const insertedItem = _.omit(mappedItem.toJSON(), ['id']);
    insertedItem.parentId = solutionId;
    insertedItem.unitPriceId = GSUnitPriceEnum.Toman;
    await this.repository.create(insertedItem, { transaction: transaction });
  }

  private async createOrUpdateProvinceSolutions(
    solutionId: number,
    solutionProvinces?: ChildSolutionDto[],
    transaction?: Transaction,
  ) {
    for (const solutionProvince of solutionProvinces) {
      const solution = await this.repository.findOne(
        new QueryOptionsBuilder()
          .filter({ parentId: solutionId })
          .filter({ provinceId: solutionProvince.provinceId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('GSSolution.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .transaction(transaction)
          .build(),
      );
      if (!solution) {
        await this.createProvinceSolution(
          solutionId,
          solutionProvince,
          transaction,
        );
      } else {
        const mappedItem = this.mapper.map(
          solutionProvince,
          ChildSolutionDto,
          GSSolution,
        );
        const updatedItem = _.omit(mappedItem.toJSON(), ['id']);
        updatedItem.parentId = solutionId;
        updatedItem.unitPriceId = GSUnitPriceEnum.Toman;
        await this.repository.update(updatedItem, {
          where: { id: solution.id },
          transaction: transaction,
        });
      }
    }
  }
}
