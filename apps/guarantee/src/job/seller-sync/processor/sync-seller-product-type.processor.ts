import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  SELLER_PRODUCT_TYPE_OFFSET,
  SYNC_SELLER_PRODUCT_TYPE_QUEUE,
} from '../constants';
import { InjectModel } from '@nestjs/sequelize';
import { GSProductType } from '@rahino/localdatabase/models';
import { Setting } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { SellerProductTypeService } from '@rahino/guarantee/util/seller-product-type';
import { GSProviderEnum } from '@rahino/guarantee/shared/provider';
import { Op } from 'sequelize';

@Processor(SYNC_SELLER_PRODUCT_TYPE_QUEUE)
export class SellerProductTypeProcessor extends WorkerHost {
  constructor(
    @InjectModel(Setting) private readonly settingRepository: typeof Setting,
    @InjectModel(GSProductType)
    private readonly productTypeRepository: typeof GSProductType,
    private readonly sellerProductTypeService: SellerProductTypeService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      await this.fetchDataAndSync();
    } catch {
      return Promise.reject(true);
    }
    return Promise.resolve(true);
  }

  async fetchDataAndSync() {
    const setting = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: SELLER_PRODUCT_TYPE_OFFSET })
        .build(),
    );
    const fromId = Number(setting.value);
    const limit = 10;
    let page = 1;
    let lastItemId = fromId;
    while (true) {
      const result = await this.sellerProductTypeService.getAll({
        id: fromId,
        per_page: limit,
        page: page,
      });

      if (result.data.length == 0) break;

      const sellerItemIds = result.data.map((item) => item.id);
      const localBrands = await this.productTypeRepository.findAll(
        new QueryOptionsBuilder()
          .filter({
            providerId: GSProviderEnum.SELLER,
          })
          .filter({
            providerBaseId: {
              [Op.in]: sellerItemIds,
            },
          })
          .build(),
      );

      const sellerSourceItems = result.data;
      for (const sellerItem of sellerSourceItems) {
        const duplicateItem = localBrands.find(
          (localBrand) => localBrand.providerBaseId == sellerItem.id,
        );
        if (!duplicateItem) {
          await this.productTypeRepository.create({
            providerBaseId: sellerItem.id,
            title: sellerItem.name,
            providerId: GSProviderEnum.SELLER,
          });
        }
      }

      const lastItem = sellerSourceItems[sellerSourceItems.length - 1];
      lastItemId = lastItem.id;

      if (result.last_page != page) {
        page += 1;
      } else {
        break;
      }
    }

    setting.value = lastItemId.toString();
    await setting.save();
  }
}
