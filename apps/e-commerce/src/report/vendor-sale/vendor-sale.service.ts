import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GetVendorSaleDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { PersianDate } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { SaleQueryBuilderService } from '../sale-query-builder/sale-query-builder.service';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { Sequelize } from 'sequelize';
import { User } from '@rahino/database';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';

@Injectable()
export class VendorSaleService {
  constructor(
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectModel(ECOrderDetail)
    private readonly orderDetailRepository: typeof ECOrderDetail,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly adminSaleQueryBuilder: SaleQueryBuilderService,
    private readonly userVendorService: UserVendorService,
  ) {}

  async findAll(user: User, filter: GetVendorSaleDto) {
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
    const isValidBeginDate = await this.isValidDate(filter.beginDate);
    if (!isValidBeginDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const isValidEndDate = await this.isValidDate(filter.endDate);
    if (!isValidEndDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    let queryBuilder = this.adminSaleQueryBuilder
      .init(false)
      .nonDeleted()
      .nonDeletedOrder()
      .onlyPaid()
      .includeInventoryPrice()
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate);

    if (filter.variationPriceId) {
      queryBuilder = queryBuilder.addVariationPriceId(filter.variationPriceId);
    }

    if (filter.vendorId) {
      queryBuilder = queryBuilder.onlyVendor(filter.vendorId);
    }

    const count = await this.orderDetailRepository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .attributes([
        'id',
        'orderId',
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
            Sequelize.col('ECOrderDetail.productPrice'),
            0,
          ),
          'unitPrice',
        ],
        [
          Sequelize.literal('isnull(ECOrderDetail.productPrice, 0) * qty'),
          'productPrice',
        ],
        'discountFee',
        'totalPrice',
        'commissionAmount',
        [
          Sequelize.literal(
            'isnull(ECOrderDetail.totalPrice, 0) - isnull(ECOrderDetail.commissionAmount, 0)',
          ),
          'vendorRevenue',
        ],
        [
          Sequelize.literal(
            'isnull(ECOrderDetail.totalPrice, 0) - isnull(inventoryPrice.buyPrice, 0) * qty - isnull(ECOrderDetail.commissionAmount, 0)',
          ),
          'profitAmount',
        ],
      ])
      .includeProduct()
      .includeInventory()
      .includeVendor()

      .offset(filter.offset)
      .limit(filter.limit);

    return {
      result: await this.orderDetailRepository.findAll(queryBuilder.build()),
      total: count,
    };
  }

  async total(user: User, filter: GetVendorSaleDto) {
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
    const isValidBeginDate = await this.isValidDate(filter.beginDate);
    if (!isValidBeginDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const isValidEndDate = await this.isValidDate(filter.endDate);
    if (!isValidEndDate) {
      throw new BadRequestException(
        this.i18n.t('ecommerce.date_is_invalid', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    let queryBuilder = this.adminSaleQueryBuilder
      .init(true)
      .nonDeleted()
      .nonDeletedOrder()
      .onlyPaid()
      .includeInventoryPrice()
      .addBeginDate(filter.beginDate)
      .addEndDate(filter.endDate);

    if (filter.vendorId) {
      queryBuilder = queryBuilder.onlyVendor(filter.vendorId);
    }

    if (filter.variationPriceId) {
      queryBuilder = queryBuilder.addVariationPriceId(filter.variationPriceId);
    }

    queryBuilder = queryBuilder
      .attributes([
        [
          Sequelize.literal('count(distinct ECOrderDetail.orderId)'),
          'cntOrder',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('ECOrderDetail.qty')),
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
              Sequelize.literal('isnull(ECOrderDetail.productPrice, 0) * qty'),
            ),
            0,
          ),
          'productPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('ECOrderDetail.discountFee')),
            0,
          ),
          'discountFee',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('ECOrderDetail.totalPrice')),
            0,
          ),
          'totalPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.col('ECOrderDetail.commissionAmount'),
            ),
            0,
          ),
          'commissionAmount',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal(
              'sum(isnull(ECOrderDetail.totalPrice, 0) - isnull(ECOrderDetail.commissionAmount, 0))',
            ),
            0,
          ),
          'vendorRevenue',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.literal(
              'sum(isnull(ECOrderDetail.totalPrice, 0) - isnull(inventoryPrice.buyPrice, 0) * qty - isnull(ECOrderDetail.commissionAmount, 0))',
            ),
            0,
          ),
          'profitAmount',
        ],
      ])
      .rawQuery(true);

    const findOptions = queryBuilder.build();
    findOptions.order = null;
    findOptions.offset = null;
    findOptions.limit = null;

    return {
      result: await this.orderDetailRepository.findOne(findOptions),
    };
  }

  async isValidDate(date: string) {
    const findDate = await this.persianDateRepository.findOne(
      new QueryOptionsBuilder().filter({ GregorianDate: date }).build(),
    );
    if (!findDate) return false;
    return true;
  }
}
