import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PersianDate } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { ECLogisticOrderGroupedDetail } from '@rahino/localdatabase/models';
import { Sequelize } from 'sequelize';
import { LogisticSaleQueryBuilderService } from '../sale-query-builder/logistic-sale-query-builder.service';
import { GetAdminSaleDto } from '../../admin-sale/dto';

@Injectable()
export class BasedAdminSaleService {
  constructor(
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectModel(ECLogisticOrderGroupedDetail)
    private readonly groupedDetailRepository: typeof ECLogisticOrderGroupedDetail,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly saleQueryBuilder: LogisticSaleQueryBuilderService,
  ) {}

  async findAll(filter: GetAdminSaleDto) {
    await this.validateDates(filter.beginDate, filter.endDate);
    let qb = this.saleQueryBuilder
      .init(false)
      .nonDeleted()
      .nonDeletedGroup()
      .nonDeletedOrder()
      .onlyPaid()
      .includeInventoryPrice()
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate);

    if (filter.vendorId) qb = qb.onlyVendor(filter.vendorId);
    if (filter.variationPriceId)
      qb = qb.addVariationPriceId(filter.variationPriceId);

    const count = await this.groupedDetailRepository.count(qb.build());

    qb = qb
      .attributes([
        'id',
        'groupedId',
        'orderDetailStatusId',
        'vendorId',
        'productId',
        'inventoryId',
        'qty',
        [
          Sequelize.fn('isnull', Sequelize.col('inventoryPrice.buyPrice'), 0),
          'buyPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECLogisticOrderGroupedDetail.productPrice'),
            0,
          ),
          'unitPrice',
        ],
        [
          Sequelize.literal(
            'isnull(ECLogisticOrderGroupedDetail.productPrice, 0) * qty',
          ),
          'productPrice',
        ],
        'discountFee',
        'totalPrice',
        'commissionAmount',
        [
          Sequelize.literal(
            'isnull(ECLogisticOrderGroupedDetail.totalPrice, 0) - isnull(ECLogisticOrderGroupedDetail.commissionAmount, 0)',
          ),
          'vendorRevenue',
        ],
        [
          Sequelize.literal(
            'isnull(ECLogisticOrderGroupedDetail.totalPrice, 0) - isnull(inventoryPrice.buyPrice, 0) * qty - isnull(ECLogisticOrderGroupedDetail.commissionAmount, 0)',
          ),
          'profitAmount',
        ],
      ])
      .includeProduct()
      .includeInventory()
      .includeVendor()
      .offset(filter.offset)
      .limit(filter.limit);

    const result = await this.groupedDetailRepository.findAll(qb.build());
    return { result, total: count };
  }

  async total(filter: GetAdminSaleDto) {
    await this.validateDates(filter.beginDate, filter.endDate);

    let qb = this.saleQueryBuilder
      .init(true)
      .nonDeleted()
      .nonDeletedGroup()
      .nonDeletedOrder()
      .onlyPaid()
      .includeInventoryPrice()
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate);

    if (filter.vendorId) qb = qb.onlyVendor(filter.vendorId);
    if (filter.variationPriceId)
      qb = qb.addVariationPriceId(filter.variationPriceId);

    qb = qb
      .attributes([
        [
          Sequelize.literal('count(distinct grouped.logisticOrderId)'),
          'cntOrder',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.col('ECLogisticOrderGroupedDetail.qty'),
            ),
            0,
          ),
          'qty',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.literal('isnull(inventoryPrice.buyPrice, 0) * qty'),
            ),
            0,
          ),
          'buyPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.literal(
                'isnull(ECLogisticOrderGroupedDetail.productPrice, 0) * qty',
              ),
            ),
            0,
          ),
          'productPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.col('ECLogisticOrderGroupedDetail.discountFee'),
            ),
            0,
          ),
          'discountFee',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.col('ECLogisticOrderGroupedDetail.totalPrice'),
            ),
            0,
          ),
          'totalPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.col('ECLogisticOrderGroupedDetail.commissionAmount'),
            ),
            0,
          ),
          'commissionAmount',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal(
              'sum(isnull(ECLogisticOrderGroupedDetail.totalPrice, 0) - isnull(ECLogisticOrderGroupedDetail.commissionAmount, 0))',
            ),
            0,
          ),
          'vendorRevenue',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal(
              'sum(isnull(ECLogisticOrderGroupedDetail.totalPrice, 0) - isnull(inventoryPrice.buyPrice, 0) * qty - isnull(ECLogisticOrderGroupedDetail.commissionAmount, 0))',
            ),
            0,
          ),
          'profitAmount',
        ],
      ])
      .rawQuery(true);

    const findOptions = qb.build();
    findOptions.order = null as any;
    findOptions.offset = null as any;
    findOptions.limit = null as any;

    const result = await this.groupedDetailRepository.findOne(findOptions);
    return { result };
  }

  private async validateDates(beginDate: string, endDate: string) {
    const isValidBeginDate = await this.isValidDate(beginDate);
    if (!isValidBeginDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const isValidEndDate = await this.isValidDate(endDate);
    if (!isValidEndDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }
  }

  private async isValidDate(date: string) {
    const findDate = await this.persianDateRepository.findOne(
      new QueryOptionsBuilder().filter({ GregorianDate: date }).build(),
    );
    return !!findDate;
  }
}
