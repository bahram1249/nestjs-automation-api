import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, PersianDate } from '@rahino/database';
import { ECLogisticOrderGroupedDetail } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { GetProductSaleDto } from './dto/get-product-sale.dto';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';
import { LogisticSaleQueryBuilderService } from '../sale-query-builder/logistic-sale-query-builder.service';
import { Sequelize } from 'sequelize';
@Injectable()
export class BasedProductSaleService {
  constructor(
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectModel(ECLogisticOrderGroupedDetail)
    private readonly groupedDetailRepository: typeof ECLogisticOrderGroupedDetail,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly saleQueryBuilder: LogisticSaleQueryBuilderService,
    private readonly userVendorService: UserVendorService,
  ) {}

  async findAll(user: User, filter: GetProductSaleDto) {
    const isAccessToVendor = await this.userVendorService.isAccessToVendor(
      user,
      filter.vendorId,
    );
    if (!isAccessToVendor) {
      throw new ForbiddenException(
        this.i18n.t('ecommerce.dont_access_to_this_vendor', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    await this.validateDates(filter.beginDate, filter.endDate);
    let qb = this.saleQueryBuilder
      .init(false)
      .nonDeleted()
      .nonDeletedGroup()
      .nonDeletedOrder()
      .onlyPaid()
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate);

    if (filter.vendorId) qb = qb.onlyVendor(filter.vendorId);
    if (filter.variationPriceId)
      qb = qb.addVariationPriceId(filter.variationPriceId);

    const countQb = new LogisticSaleQueryBuilderService()
      .init(true)
      .nonDeleted()
      .nonDeletedGroup()
      .nonDeletedOrder()
      .onlyPaid()
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate);

    if (filter.vendorId) countQb.onlyVendor(filter.vendorId);
    if (filter.variationPriceId)
      countQb.addVariationPriceId(filter.variationPriceId);

    const countResult = await this.groupedDetailRepository.findOne(
      countQb
        .attributes([
          [
            Sequelize.fn(
              'COUNT',
              Sequelize.literal(
                'DISTINCT ECLogisticOrderGroupedDetail.productId',
              ),
            ),
            'total',
          ],
        ])
        .build(),
    );
    const count = countResult.get('total');

    qb = qb
      .attributes([
        [
          Sequelize.fn(
            'sum',
            Sequelize.col('ECLogisticOrderGroupedDetail.qty'),
          ),
          'qty',
        ],
        'vendorId',
        'productId',
        [Sequelize.col('vendor.name'), 'vendorName'],
        [Sequelize.col('vendor.slug'), 'vendorSlug'],
        [Sequelize.col('product.title'), 'productTitle'],
        [Sequelize.col('product.sku'), 'productSku'],
        [Sequelize.col('product.slug'), 'productSlug'],
      ])
      .includeVendor()
      .includeProduct()
      .group([
        'ECLogisticOrderGroupedDetail.productId',
        'vendor.id',
        'vendor.name',
        'vendor.slug',
        'product.title',
        'product.slug',
        'product.sku',
      ])
      .offset(filter.offset)
      .limit(filter.limit)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.groupedDetailRepository.findAll(qb.build());
    return { result, total: count };
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
