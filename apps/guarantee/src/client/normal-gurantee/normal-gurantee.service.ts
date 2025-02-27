import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GSAssignedGuarantee, GSGuarantee, User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { NormalGuaranteeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { GSGuaranteeTypeEnum } from '@rahino/guarantee/admin/gurantee-type';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as _ from 'lodash';

@Injectable()
export class NormalGuaranteeService {
  constructor(
    @InjectModel(GSAssignedGuarantee)
    private readonly assignedGuaranteeRepository: typeof GSAssignedGuarantee,
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepository: typeof GSGuarantee,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    let query = new QueryOptionsBuilder()
      .include([
        {
          model: GSGuarantee,
          as: 'guarantee',
          required: true,
          where: {
            [Op.and]: [
              { guaranteeTypeId: GSGuaranteeTypeEnum.Normal },
              {
                serialNumber: {
                  [Op.like]: filter.search,
                },
              },
            ],
          },
        },
      ])
      .filter({ userId: user.id })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSAssignedGuarantee.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.assignedGuaranteeRepository.count(query.build());
    query = query.offset(filter.offset).limit(filter.limit);
    const assignedGuarantees = await this.assignedGuaranteeRepository.findAll(
      query.build(),
    );
    const result = assignedGuarantees.map(
      (assignedGuarantee) => assignedGuarantee.guarantee,
    );
    return {
      result: result,
      total: count,
    };
  }

  async findById(user: User, entityId: bigint) {
    let query = new QueryOptionsBuilder()
      .include([
        {
          model: GSGuarantee,
          as: 'guarantee',
          required: true,
          where: {
            [Op.and]: [
              { guaranteeTypeId: GSGuaranteeTypeEnum.Normal },
              {
                id: entityId,
              },
            ],
          },
        },
      ])
      .filter({ userId: user.id })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSAssignedGuarantee.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const assignedGuarantee = await this.assignedGuaranteeRepository.findOne(
      query.build(),
    );

    if (!assignedGuarantee) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return {
      result: assignedGuarantee.guarantee,
    };
  }

  async create(user: User, dto: NormalGuaranteeDto) {
    const guarantee = await this.guaranteeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ serialNumber: dto.serialNumber })
        .filter({ guaranteeTypeId: GSGuaranteeTypeEnum.Normal })
        .build(),
    );

    if (!guarantee) {
      throw new NotFoundException(
        this.i18n.t('guarantee.details_of_requested_card_is_not_found', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const currentDate = new Date();
    if (guarantee.endDate < currentDate) {
      throw new NotFoundException(
        this.i18n.t('guarantee.expire_date_of_card_is_reach', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    let query = new QueryOptionsBuilder()
      .include([
        {
          model: GSGuarantee,
          as: 'guarantee',
          required: true,
          where: {
            [Op.and]: [
              { guaranteeTypeId: GSGuaranteeTypeEnum.Normal },
              { serialNumber: dto.serialNumber },
            ],
          },
        },
      ])
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSAssignedGuarantee.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const assignedGuarantee = await this.assignedGuaranteeRepository.findOne(
      query.build(),
    );

    if (assignedGuarantee != null && assignedGuarantee.userId != user.id) {
      throw new BadRequestException(
        this.i18n.t(
          'guarantee.this_card_assigned_to_another_user_call_support_user',
          {
            lang: I18nContext.current().lang,
          },
        ),
      );
    }

    if (assignedGuarantee) {
      throw new BadRequestException(
        this.i18n.t('guarantee.you_entered_this_card_before', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    await this.assignedGuaranteeRepository.create({
      guaranteeId: guarantee.id,
      userId: user.id,
    });

    return {
      result: _.pick(guarantee, ['id', 'serialNumber']),
    };
  }
}
