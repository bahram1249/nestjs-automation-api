import { Injectable } from '@nestjs/common';
import { GetIncomeReportDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSFactor, GSRequest } from '@rahino/localdatabase/models';
import { Op, Sequelize } from 'sequelize';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSFactorTypeEnum } from '@rahino/guarantee/shared/factor-type';
import { GSFactorStatusEnum } from '@rahino/guarantee/shared/factor-status';
import * as ExcelJS from 'exceljs';
import { Buffer as NodeBuffer } from 'buffer';

@Injectable()
export class IncomeReportService {
  constructor(
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,
    private readonly localizationService: LocalizationService,
  ) {}

  private buildBaseQuery(
    filter: GetIncomeReportDto,
    options?: { includeAttributesEmpty?: boolean },
  ) {
    const includeAttributesEmpty = options?.includeAttributesEmpty ?? false;

    let queryBuilder = new QueryOptionsBuilder();

    queryBuilder
      .include([
        {
          model: GSRequest,
          as: 'guaranteeRequest',
          required: true,
          ...(includeAttributesEmpty ? { attributes: [] } : {}),
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

    return queryBuilder;
  }

  async findAll(filter: GetIncomeReportDto) {
    let queryBuilder = this.buildBaseQuery(filter);

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
    let queryBuilder = this.buildBaseQuery(filter, {
      includeAttributesEmpty: true,
    });

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

  async exportExcel(filter: GetIncomeReportDto): Promise<Buffer> {
    // Build query using the same filters as findAll, but without pagination
    const queryBuilder = this.buildBaseQuery(filter).attributes([
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
    ]);

    const findOptions = queryBuilder.build();
    // Ensure no paging is applied
    findOptions.offset = null;
    findOptions.limit = null;

    const rows = (await this.factorRepository.findAll(findOptions)) as any[];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('IncomeReports');
    sheet.columns = [
      { header: 'شناسه فاکتور', key: 'id', width: 14 },
      { header: 'شناسه درخواست', key: 'requestId', width: 16 },
      {
        header: 'درصد سهم نماینده',
        key: 'representativeSharePercent',
        width: 18,
      },
      {
        header: 'جمع اجرت داخل گارانتی',
        key: 'sumOfSolutionIncludeWarranty',
        width: 22,
      },
      {
        header: 'جمع اجرت خارج از گارانتی',
        key: 'sumOfSolutionOutOfWarranty',
        width: 22,
      },
      {
        header: 'جمع قطعه داخل گارانتی',
        key: 'sumOfPartIncludeWarranty',
        width: 22,
      },
      {
        header: 'جمع قطعه خارج از گارانتی',
        key: 'sumOfPartOutOfWarranty',
        width: 22,
      },
      {
        header: 'حداقل پرداخت مشتری (خارج از گارانتی)',
        key: 'atLeastPayFromCustomerForOutOfWarranty',
        width: 30,
      },
      { header: 'پرداخت نقدی', key: 'givenCashPayment', width: 16 },
      {
        header: 'پرداخت نقدی اضافه برای VIP ناموجود',
        key: 'extraCashPaymentForUnavailableVip',
        width: 30,
      },
      { header: 'سازمان به شرکت', key: 'organizationToCompany', width: 18 },
      { header: 'شرکت به سازمان', key: 'companyToOrganization', width: 18 },
      {
        header: 'جمع سازمان به شرکت',
        key: 'sumOfOrganizationToCompany',
        width: 22,
      },
      {
        header: 'جمع شرکت به سازمان',
        key: 'sumOfCompanyToOrganization',
        width: 22,
      },
      { header: 'تاریخ تسویه', key: 'settlementDate', width: 16 },
    ];

    const toPlain = (v: any) => {
      if (v === null || v === undefined) return '';
      if (typeof v === 'bigint') return v.toString();
      if (v instanceof Date) return v.toISOString().slice(0, 10);
      if (typeof v === 'object' && 'toString' in v)
        return (v as any).toString();
      return v;
    };

    for (const r of rows) {
      sheet.addRow({
        id: toPlain(r.id),
        requestId: toPlain(
          (r as any).get?.('requestId') ?? (r as any).requestId,
        ),
        representativeSharePercent: toPlain(r.representativeSharePercent),
        sumOfSolutionIncludeWarranty: toPlain(r.sumOfSolutionIncludeWarranty),
        sumOfSolutionOutOfWarranty: toPlain(r.sumOfSolutionOutOfWarranty),
        sumOfPartIncludeWarranty: toPlain(r.sumOfPartIncludeWarranty),
        sumOfPartOutOfWarranty: toPlain(r.sumOfPartOutOfWarranty),
        atLeastPayFromCustomerForOutOfWarranty: toPlain(
          r.atLeastPayFromCustomerForOutOfWarranty,
        ),
        givenCashPayment: toPlain(r.givenCashPayment),
        extraCashPaymentForUnavailableVip: toPlain(
          r.extraCashPaymentForUnavailableVip,
        ),
        organizationToCompany: toPlain(r.organizationToCompany),
        companyToOrganization: toPlain(r.companyToOrganization),
        sumOfOrganizationToCompany: toPlain(r.sumOfOrganizationToCompany),
        sumOfCompanyToOrganization: toPlain(r.sumOfCompanyToOrganization),
        settlementDate: toPlain(r.settlementDate),
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return NodeBuffer.from(buffer);
  }
}
