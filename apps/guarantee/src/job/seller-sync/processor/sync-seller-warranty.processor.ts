import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
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
} from '@rahino/localdatabase/models';
import { Setting } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { SellerWarrantyService } from '@rahino/guarantee/util/seller-warranty';
import { GSProviderEnum } from '@rahino/guarantee/shared/provider';
import { Op } from 'sequelize';
import { GSGuaranteeTypeEnum } from '@rahino/guarantee/shared/gurantee-type';
import { GSGuaranteeConfirmStatus } from '@rahino/guarantee/shared/guarantee-confirm-status';
import { DBLogger } from '@rahino/logger';

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
    private readonly logger: DBLogger,
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
    const setting = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: SELLER_GUARANTEE_OFFSET })
        .build(),
    );
    let fromId = Number(setting.value);
    fromId = fromId - 1000;
    if (fromId < 0) fromId = 0;
    const limit = 100; // Increased limit for better performance
    let page = 1;
    let lastItemId = fromId;

    // Pre-fetch all guarantee periods
    const guaranteePeriods = await this.guaranteePeriodRepository.findAll();
    const guaranteePeriodMap = new Map<string, GSGuaranteePeriod>();
    guaranteePeriods.forEach((period) => {
      guaranteePeriodMap.set(period.providerText, period);
    });

    while (true) {
      const result = await this.sellerWarrantyService.getAll({
        id: fromId,
        per_page: limit,
        page: page,
      });

      if (result.data.length == 0) break;

      const sellerSourceItems = result.data;
      const sellerItemIds = sellerSourceItems.map((item) => item.id);

      // 1. Get existing guarantees providerBaseIds
      const existingGuarantees = await this.guaranteeRepository.findAll({
        attributes: ['providerBaseId'],
        where: {
          providerId: GSProviderEnum.SELLER,
          providerBaseId: {
            [Op.in]: sellerItemIds,
          },
        },
      });
      const existingProviderBaseIds = new Set(
        existingGuarantees.map((g) => g.providerBaseId),
      );

      // 2. Filter out duplicates
      const newSellerItems = sellerSourceItems.filter(
        (item) => !existingProviderBaseIds.has(item.id),
      );

      if (newSellerItems.length > 0) {
        // 3. Aggregate names
        const brandNames = [
          ...new Set(newSellerItems.map((item) => item.brand_name).filter(Boolean)),
        ];
        const productTypeNames = [
          ...new Set(
            newSellerItems.map((item) => item.product_name).filter(Boolean),
          ),
        ];
        const variantNames = [
          ...new Set(
            newSellerItems.map((item) => item.variant_name).filter(Boolean),
          ),
        ];

        // 4. Fetch or create related entities in bulk
        const brandMap = await this.getOrCreateItems(
          this.brandRepository,
          brandNames,
          GSProviderEnum.SELLER,
        );
        const productTypeMap = await this.getOrCreateItems(
          this.productTypeRepository,
          productTypeNames,
          GSProviderEnum.SELLER,
        );
        const variantMap = await this.getOrCreateItems(
          this.variantRepository,
          variantNames,
          GSProviderEnum.SELLER,
        );

        // 5. Prepare for bulk insert
        const guaranteesToCreate = [];
        for (const sellerItem of newSellerItems) {
          const brand = brandMap.get(sellerItem.brand_name);
          const productType = productTypeMap.get(sellerItem.product_name);
          const variant = variantMap.get(sellerItem.variant_name);
          const guaranteePeriod = guaranteePeriodMap.get(
            sellerItem.warranty_period,
          );

          if (brand && productType && variant && guaranteePeriod) {
            guaranteesToCreate.push({
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

        // 6. Bulk insert
        if (guaranteesToCreate.length > 0) {
          await this.guaranteeRepository.bulkCreate(guaranteesToCreate);
        }
      }

      const lastItem = sellerSourceItems[sellerSourceItems.length - 1];
      lastItemId = lastItem.id;

      if (result.last_page == page) break;

      page += 1;
    }

    setting.value = lastItemId.toString();
    await setting.save();
  }

  private async getOrCreateItems(
    repository: any,
    values: string[],
    providerId: number,
  ): Promise<Map<string, any>> {
    const uniqueValues = [...new Set(values.filter(Boolean))];
    const itemMap = new Map<string, any>();
    if (uniqueValues.length === 0) {
      return itemMap;
    }
    const items = await repository.findAll({
      where: {
        title: { [Op.in]: uniqueValues },
        providerId: providerId,
      },
    });
    items.forEach((item) => itemMap.set(item.title, item));

    const itemsToCreate = uniqueValues.filter((value) => !itemMap.has(value));
    if (itemsToCreate.length > 0) {
      const newItems = await repository.bulkCreate(
        itemsToCreate.map((value) => ({ title: value, providerId: providerId })),
        { returning: true },
      );
      newItems.forEach((item) => itemMap.set(item.title, item));
    }

    return itemMap;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.logger.warn(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`,
    );
  }
}
