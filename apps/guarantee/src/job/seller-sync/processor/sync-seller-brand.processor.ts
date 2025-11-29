import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SELLER_BRAND_OFFSET, SYNC_SELLER_BRAND_QUEUE } from '../constants';
import { SellerBrandService } from '@rahino/guarantee/util/seller-brand';
import { InjectModel } from '@nestjs/sequelize';
import { GSBrand } from '@rahino/localdatabase/models';
import { Setting } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSProviderEnum } from '@rahino/guarantee/shared/provider';
import { Op } from 'sequelize';

@Processor(SYNC_SELLER_BRAND_QUEUE)
export class SellerBrandProcessor extends WorkerHost {
  constructor(
    private readonly sellerBrandService: SellerBrandService,
    @InjectModel(Setting) private readonly settingRepository: typeof Setting,
    @InjectModel(GSBrand) private readonly brandRepository: typeof GSBrand,
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
      new QueryOptionsBuilder().filter({ key: SELLER_BRAND_OFFSET }).build(),
    );
    const fromId = Number(setting.value);
    const limit = 10;
    let page = 1;
    let lastItemId = fromId;
    while (true) {
      const result = await this.sellerBrandService.getAll({
        id: fromId,
        per_page: limit,
        page: page,
      });

      if (result.data.length == 0) break;

      const sellerItemIds = result.data.map((item) => item.id);
      const localBrands = await this.brandRepository.findAll(
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
          await this.brandRepository.create({
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
