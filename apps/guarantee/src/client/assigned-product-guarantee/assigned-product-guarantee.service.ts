import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AssignedProductGuaranteeDto,
  GetAssignedProductGuarantee,
} from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import * as _ from 'lodash';
import {
  GSAssignedGuarantee,
  GSAssignedProductAssignedGuarantee,
  GSBrand,
  GSProductType,
  GSVariant,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class AssignedProductGuaranteeService {
  constructor(
    @InjectModel(GSAssignedProductAssignedGuarantee)
    private repository: typeof GSAssignedProductAssignedGuarantee,
    @InjectModel(GSAssignedGuarantee)
    private readonly asssignedGuaranteeRepository: typeof GSAssignedGuarantee,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(user: User, guaranteeId, filter: GetAssignedProductGuarantee) {
    const assignedGuarantee = await this.asssignedGuaranteeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ guaranteeId: guaranteeId })
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
        )
        .build(),
    );

    if (!assignedGuarantee) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.details_of_requested_card_is_not_found',
        ),
      );
    }

    let queryBuilder = new QueryOptionsBuilder()
      .filter({
        assignedGuaranteeId: assignedGuarantee.id,
      })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSAssignedProductAssignedGuarantee.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .attributes(['id', 'productTypeId', 'brandId', 'variantId'])
      .include([
        {
          model: GSProductType,
          as: 'productType',
          attributes: ['id', 'title'],
        },
        {
          model: GSBrand,
          as: 'brand',
          attributes: ['id', 'title'],
        },
        {
          model: GSVariant,
          as: 'variant',
          attributes: ['id', 'title'],
        },
      ])
      .offset(filter.offset)
      .limit(filter.limit);

    const result = await this.repository.findAll(queryBuilder.build());

    return {
      result: result,
      total: count,
    };
  }

  async findById(user: User, entityId: bigint) {
    const assigenedProductAssignedGuarantee = await this.repository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSProductType,
            as: 'productType',
            attributes: ['id', 'title'],
          },
          {
            model: GSBrand,
            as: 'brand',
            attributes: ['id', 'title'],
          },
          {
            model: GSVariant,
            as: 'variant',
            attributes: ['id', 'title'],
          },
          {
            model: GSAssignedGuarantee,
            as: 'assignedGuarantee',
            attributes: ['guaranteeId', 'userId'],
            required: true,
            where: {
              [Op.and]: [
                {
                  isDeleted: {
                    [Op.is]: null,
                  },
                },
                {
                  userId: user.id,
                },
              ],
            },
          },
        ])
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSAssignedProductAssignedGuarantee.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!assigenedProductAssignedGuarantee) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    return {
      result: assigenedProductAssignedGuarantee,
    };
  }

  async create(user: User, dto: AssignedProductGuaranteeDto) {
    const assigendGuarantee = await this.asssignedGuaranteeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ guaranteeId: dto.guaranteeId })
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
        )
        .build(),
    );

    if (!assigendGuarantee) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.details_of_requested_card_is_not_found',
        ),
      );
    }

    const assignedProductAssignedGuarantee = await this.repository.create({
      assignedGuaranteeId: assigendGuarantee.id,
      productTypeId: dto.productTypeId,
      brandId: dto.brandId,
      variantId: dto.variantId,
    });

    return {
      result: assignedProductAssignedGuarantee,
    };
  }

  async deleteById(user: User, entityId: bigint) {
    const { result } = await this.findById(user, entityId);
    const assignedProductAssignedGuarantee = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id: result.id }).build(),
    );

    assignedProductAssignedGuarantee.isDeleted = true;
    await assignedProductAssignedGuarantee.save();

    return {
      result: assignedProductAssignedGuarantee,
    };
  }
}
