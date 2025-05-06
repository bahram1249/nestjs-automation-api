import { Injectable } from '@nestjs/common';
import { GetIncomeReportDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSFactor, GSRequest } from '@rahino/localdatabase/models';
import { Op, Sequelize } from 'sequelize';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSFactorTypeEnum } from '@rahino/guarantee/shared/factor-type';
import { GSFactorStatusEnum } from '@rahino/guarantee/shared/factor-status';

@Injectable()
export class IncomeReportService {
  constructor(
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: GetIncomeReportDto) {
    let queryBuilder = new QueryOptionsBuilder();

    queryBuilder
      .include([
        {
          model: GSRequest,
          as: 'guaranteeRequest',
          required: true,
        },
      ])
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSFactor.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({
        factorTypeId: GSFactorTypeEnum.PayRequestFactor,
      })
      .filter({
        factorStatusId: GSFactorStatusEnum.Paid,
      })
      .filter({
        settlementDate: {
          [Op.between]: [filter.beginDate, filter.endDate],
        },
      });

    if (filter.organizationId) {
      queryBuilder = queryBuilder.filter({
        '$guaranteeRequest.organizationId$': filter.organizationId,
      });
    }

    const count = await this.factorRepository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .attributes([
        'id',
        'representativeSharePercent',
        'sumOfSolutionIncludeWarranty',
        'sumOfSolutionOutOfWarranty',
        'sumOfPartIncludeWarranty',
        'sumOfPartOutOfWarranty',
        'atLeastPayFromCustomerForOutOfWarranty',
        'givenCashPayment',
        'extraCashPaymentForUnavailableVip',
        'organizationToCompany',
        'companyToOrganization',
        'sumOfOrganizationToCompany',
        'sumOfCompanyToOrganization',
        'settlementDate',
        [Sequelize.col('guaranteeRequest.id'), 'requestId'],
      ])

      .offset(filter.offset)
      .limit(filter.limit);

    return {
      result: await this.factorRepository.findAll(queryBuilder.build()),
      total: count,
    };
  }

  async total(filter: GetIncomeReportDto) {
    let queryBuilder = new QueryOptionsBuilder();

    queryBuilder
      .include([
        {
          model: GSRequest,
          as: 'guaranteeRequest',
          required: true,
        },
      ])
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSFactor.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({
        factorTypeId: GSFactorTypeEnum.PayRequestFactor,
      })
      .filter({
        factorStatusId: GSFactorStatusEnum.Paid,
      })
      .filter({
        settlementDate: {
          [Op.between]: [filter.beginDate, filter.endDate],
        },
      });

    if (filter.organizationId) {
      queryBuilder = queryBuilder.filter({
        '$guaranteeRequest.organizationId$': filter.organizationId,
      });
    }

    queryBuilder = queryBuilder
      .attributes([
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('representativeSharePercent')),
            0,
          ),
          'representativeSharePercent',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('sumOfSolutionIncludeWarranty')),
            0,
          ),
          'sumOfSolutionIncludeWarranty',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('sumOfSolutionOutOfWarranty')),
            0,
          ),
          'sumOfSolutionOutOfWarranty',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('sumOfPartIncludeWarranty')),
            0,
          ),
          'sumOfPartIncludeWarranty',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('sumOfPartOutOfWarranty')),
            0,
          ),
          'sumOfPartOutOfWarranty',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.col('atLeastPayFromCustomerForOutOfWarranty'),
            ),
            0,
          ),
          'atLeastPayFromCustomerForOutOfWarranty',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('givenCashPayment')),
            0,
          ),
          'givenCashPayment',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.col('extraCashPaymentForUnavailableVip'),
            ),
            0,
          ),
          'extraCashPaymentForUnavailableVip',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('organizationToCompany')),
            0,
          ),
          'organizationToCompany',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('companyToOrganization')),
            0,
          ),
          'companyToOrganization',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('sumOfOrganizationToCompany')),
            0,
          ),
          'sumOfOrganizationToCompany',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('sumOfCompanyToOrganization')),
            0,
          ),
          'sumOfCompanyToOrganization',
        ],
      ])
      .raw(true);

    const findOptions = queryBuilder.build();
    findOptions.order = null;
    findOptions.offset = null;
    findOptions.limit = null;

    return {
      result: await this.factorRepository.findOne(findOptions),
    };
  }
}
