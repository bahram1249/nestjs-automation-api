import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  SELLER_GUARANTEE_OFFSET,
  SYNC_SELLER_WARRANTY_QUEUE,
} from '../constants';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSBrand,
  GSGuarantee,
  GSGuaranteePeriod,
  GSProductType,
  GSVariant,
  Setting,
} from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { SellerWarrantyService } from '@rahino/guarantee/util/seller-warranty';
import { GSProviderEnum } from '@rahino/guarantee/admin/provider';
import { Op } from 'sequelize';
import { GSGuaranteeTypeEnum } from '@rahino/guarantee/admin/gurantee-type';
import { GSGuaranteeConfirmStatus } from '@rahino/guarantee/admin/guarantee-confirm-status';

@Processor(SYNC_SELLER_WARRANTY_QUEUE)
export class SellerWarrantyProcessor extends WorkerHost {
  constructor(
    @InjectModel(Setting) private readonly settingRepository: typeof Setting,
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepository: typeof GSGuarantee,
    @InjectModel(GSBrand)
    private readonly brandRepository: typeof GSBrand,
    @InjectModel(GSProductType)
    private readonly productTypeRepository: typeof GSProductType,
    @InjectModel(GSVariant)
    private readonly variantRepository: typeof GSVariant,
    @InjectModel(GSGuaranteePeriod)
    private readonly guaranteePeriodRepository: typeof GSGuaranteePeriod,
    private readonly sellerWarrantyService: SellerWarrantyService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      console.log('in seller warranty');
      await this.fetchDataAndSync();
    } catch (error) {
      console.log(error);
      return Promise.reject(true);
    }
    return Promise.resolve(true);
  }

  async fetchDataAndSync() {
    let setting = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: SELLER_GUARANTEE_OFFSET })
        .build(),
    );
    let fromId = Number(setting.value);
    fromId = fromId - 1000;
    if (fromId < 0) fromId = 0;
    const limit = 10;
    let page = 1;
    let lastItemId = fromId;
    while (true) {
      const result = await this.sellerWarrantyService.getAll({
        id: fromId,
        per_page: limit,
        page: page,
      });

      if (result.data.length == 0) break;

      let sellerItemIds = result.data.map((item) => item.id);
      const localVariants = await this.guaranteeRepository.findAll(
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
        const duplicateItem = localVariants.find(
          (localBrand) => localBrand.providerBaseId == sellerItem.id,
        );
        if (!duplicateItem) {
          const brand = await this.brandRepository.findOne(
            new QueryOptionsBuilder()
              .filter({
                providerId: GSProviderEnum.SELLER,
              })
              .filter({ title: sellerItem.brand_name })
              .build(),
          );
          const productType = await this.productTypeRepository.findOne(
            new QueryOptionsBuilder()
              .filter({
                providerId: GSProviderEnum.SELLER,
              })
              .filter({ title: sellerItem.product_name })
              .build(),
          );

          const variant = await this.variantRepository.findOne(
            new QueryOptionsBuilder()
              .filter({
                providerId: GSProviderEnum.SELLER,
              })
              .filter({ title: sellerItem.variant_name })
              .build(),
          );

          const guaranteePeriod = await this.findGuarantePeriod(
            sellerItem.warranty_period,
          );

          if (
            brand != null &&
            variant != null &&
            productType != null &&
            guaranteePeriod != null
          ) {
            await this.guaranteeRepository.create({
              providerBaseId: sellerItem.id,
              providerId: GSProviderEnum.SELLER,
              brandId: brand.id,
              productTypeId: productType.id,
              variantId: variant.id,
              guaranteeTypeId: GSGuaranteeTypeEnum.Normal,
              guaranteePeriodId: guaranteePeriod.id,
              guaranteeConfirmStatusId: GSGuaranteeConfirmStatus.Confirm,
              prefixSerial: sellerItem.prefix_serial,
              serialNumber: sellerItem.serial_number,
              startDate: sellerItem.start_date,
              endDate: sellerItem.expire_date,
              description: 'اطلاعات کانورتی از سلر',
            });
          }
        }
      }

      let lastItem = sellerSourceItems[sellerSourceItems.length - 1];
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

  async findGuarantePeriod(warrantyPeriod: string): Promise<GSGuaranteePeriod> {
    return await this.guaranteePeriodRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ providerText: warrantyPeriod })
        .build(),
    );
  }
}
