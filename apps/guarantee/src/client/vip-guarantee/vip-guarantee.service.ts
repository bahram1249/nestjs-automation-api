import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GSAssignedGuarantee,
  GSBrand,
  GSGuarantee,
  GSGuaranteePeriod,
  GSProductType,
  GSVariant,
  GSVipBundleType,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { VipGuaranteeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { GSGuaranteeTypeEnum } from '@rahino/guarantee/shared/gurantee-type';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as _ from 'lodash';
import { GSGuaranteeConfirmStatus } from '@rahino/guarantee/shared/guarantee-confirm-status';

@Injectable()
export class VipGuaranteeService {
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
          attributes: [
            'id',
            'serialNumber',
            'startDate',
            'endDate',
            'vipBundleTypeId',
            'totalCredit',
            'availableCredit',
          ],
          include: [
            {
              model: GSVipBundleType,
              as: 'vipBundleType',
              required: false,
              attributes: ['id', 'cardColor'],
            },
          ],
          where: {
            [Op.and]: [
              { guaranteeTypeId: GSGuaranteeTypeEnum.VIP },
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
          attributes: [
            'id',
            'serialNumber',
            'startDate',
            'endDate',
            'vipBundleTypeId',
            'totalCredit',
            'availableCredit',
          ],
          include: [
            {
              model: GSVipBundleType,
              as: 'vipBundleType',
              required: false,
              attributes: ['id', 'cardColor'],
            },
          ],
          where: {
            [Op.and]: [
              { guaranteeTypeId: GSGuaranteeTypeEnum.VIP },
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

  async create(user: User, dto: VipGuaranteeDto) {
    const guarantee = await this.checkGuaranteeIsValidThenReturnGuarantee(
      dto.serialNumber,
      user,
    );

    await this.assignedGuaranteeRepository.create({
      guaranteeId: guarantee.id,
      userId: user.id,
    });

    return {
      result: guarantee,
    };
  }

  async getAvailability(user: User, serialNumber: string) {
    const result = await this.checkGuaranteeIsValidThenReturnGuarantee(
      serialNumber,
      user,
    );
    return { result };
  }

  private async checkGuaranteeIsValidThenReturnGuarantee(
    serialNumber: string,
    user: User,
  ): Promise<GSGuarantee> {
    const guarantee = await this.guaranteeRepository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'serialNumber',
          'startDate',
          'endDate',
          'vipBundleTypeId',
          'totalCredit',
          'availableCredit',
        ])
        .include([
          {
            model: GSVipBundleType,
            as: 'vipBundleType',
            required: false,
            attributes: ['id', 'cardColor'],
          },
        ])
        .filter({ serialNumber: serialNumber })
        .filter({ guaranteeConfirmStatusId: GSGuaranteeConfirmStatus.Confirm })
        .filter({ guaranteeTypeId: GSGuaranteeTypeEnum.VIP })
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
              { guaranteeTypeId: GSGuaranteeTypeEnum.VIP },
              { serialNumber: serialNumber },
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
    return guarantee;
  }
}
