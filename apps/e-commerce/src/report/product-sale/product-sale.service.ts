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
import { User } from '@rahino/database';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { OrderStatusEnum } from '@rahino/ecommerce/shared/enum';

@Injectable()
export class ProductSaleService {
  constructor(
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly userVendorService: UserVendorService,
    @InjectKnex() private readonly knex: Knex,
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

    const result = await this.knex('ECOrderDetails')
      .leftJoin('ECOrders', 'ECOrderDetails.orderId', 'ECOrders.id')
      .leftJoin('ECProducts', 'ECOrderDetails.productId', 'ECProducts.id')
      .leftJoin('ECVendors', 'ECOrderDetails.vendorId', 'ECVendors.id')
      .select(
        'ECOrderDetails.vendorId',
        'ECOrderDetails.productId',
        this.knex.raw('ECProducts.title as productTitle'),
        this.knex.raw('ECProducts.sku as productSku'),
        this.knex.raw('ECProducts.slug as productSlug'),
        this.knex.raw('ECVendors.name as vendorName'),
        this.knex.raw('ECVendors.slug as vendorSlug'),
        this.knex.raw('SUM(ECOrderDetails.qty) as qty'),
      )
      .where('ECOrders.orderStatusId', '!=', OrderStatusEnum.WaitingForPayment)
      .where('ECOrderDetails.gregorianAtPersian', '>=', filter.beginDate)
      .where('ECOrderDetails.gregorianAtPersian', '<=', filter.endDate)
      .modify(function (queryBuilder) {
        if (filter.vendorId) {
          queryBuilder.where('ECOrderDetails.vendorId', filter.vendorId);
        }
      })
      .groupBy(
        'ECOrderDetails.vendorId',
        'ECOrderDetails.productId',
        'ECProducts.title',
        'ECProducts.sku',
        'ECProducts.slug',
        'ECVendors.name',
        'ECVendors.slug',
      )
      .orderBy('qty', 'desc')
      .limit(filter.limit)
      .offset(filter.offset);

    const countQuery = await this.knex('ECOrderDetails')
      .leftJoin('ECOrders', 'ECOrderDetails.orderId', 'ECOrders.id')
      .leftJoin('ECProducts', 'ECOrderDetails.productId', 'ECProducts.id')
      .leftJoin('ECVendors', 'ECOrderDetails.vendorId', 'ECVendors.id')
      .select(this.knex.raw('COUNT(*) OVER () AS totalRecords'))
      .where('ECOrders.orderStatusId', '!=', OrderStatusEnum.WaitingForPayment)
      .where('ECOrderDetails.gregorianAtPersian', '>=', filter.beginDate)
      .where('ECOrderDetails.gregorianAtPersian', '<=', filter.endDate)
      .modify(function (queryBuilder) {
        if (filter.vendorId) {
          queryBuilder.where('ECOrderDetails.vendorId', filter.vendorId);
        }
      })
      .groupBy(
        'ECOrderDetails.vendorId',
        'ECOrderDetails.productId',
        'ECProducts.title',
        'ECProducts.sku',
        'ECProducts.slug',
        'ECVendors.name',
        'ECVendors.slug',
      )
      .first();

    return {
      result: result,
      total: countQuery['totalRecords'],
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
