import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetInventoryDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECInventory } from '@rahino/localdatabase/models';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';
import { User } from '@rahino/database';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { ECProduct } from '@rahino/localdatabase/models';
import { ECColor } from '@rahino/localdatabase/models';
import { ECGuarantee } from '@rahino/localdatabase/models';
import { ECInventoryStatus } from '@rahino/localdatabase/models';

@Injectable({})
export class InventoryReportService {
  constructor(
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    private readonly userVendorService: UserVendorService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}
  async findAll(user: User, filter: GetInventoryDto) {
    const isAccess = await this.userVendorService.isAccessToVendor(
      user,
      filter.vendorId,
    );
    if (!isAccess) {
      throw new ForbiddenException(
        this.i18n.t('ecommerce.dont_access_to_this_vendor', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    let queryBuilder = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECInventory.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({
        vendorId: filter.vendorId,
      })
      .include([
        {
          attributes: ['id', 'name'],
          model: ECInventoryStatus,
          as: 'inventoryStatus',
          required: true,
        },
      ]);

    if (filter.minQty != null) {
      queryBuilder = queryBuilder.filter(
        Sequelize.where(Sequelize.col('ECInventory.qty'), {
          [Op.gte]: filter.minQty,
        }),
      );
    }

    if (filter.maxQty != null) {
      queryBuilder = queryBuilder.filter(
        Sequelize.where(Sequelize.col('ECInventory.qty'), {
          [Op.lte]: filter.maxQty,
        }),
      );
    }

    if (filter.inventoryStatusId != null) {
      queryBuilder = queryBuilder.filter(
        Sequelize.where(Sequelize.col('ECInventory.inventoryStatusId'), {
          [Op.eq]: filter.inventoryStatusId,
        }),
      );
    }

    const count = await this.inventoryRepository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .thenInclude({
        attributes: ['id', 'title', 'sku', 'slug'],
        model: ECProduct,
        as: 'product',
        required: false,
      })
      .thenInclude({
        attributes: ['id', 'name'],
        model: ECColor,
        as: 'color',
        required: false,
      })
      .thenInclude({
        attributes: ['id', 'name'],
        model: ECGuarantee,
        as: 'guarantee',
        required: false,
      })
      .attributes([
        'id',
        'productId',
        'colorId',
        'guaranteeId',
        'inventoryStatusId',
        'qty',
        'createdAt',
        'updatedAt',
      ])
      .offset(filter.offset)
      .limit(filter.limit)
      .order([Sequelize.col('ECInventory.updatedAt'), 'DESC'])
      .order([Sequelize.col('ECInventory.qty'), 'ASC']);

    return {
      result: await this.inventoryRepository.findAll(queryBuilder.build()),
      total: count,
    };
  }
}
