import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ECInventory, ECProduct } from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';
import { PRODUCT_INVENTORY_STATUS_QUEUE } from '@rahino/ecommerce/shared/inventory/constants';

@Processor('vendor')
export class VendorInventoryProcessor {
  constructor(
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    @InjectModel(ECProduct)
    private readonly productRepository: typeof ECProduct,
    @InjectQueue(PRODUCT_INVENTORY_STATUS_QUEUE)
    private readonly productInventoryStatusQueue: Queue,
  ) {}

  @Process('deactive')
  async deactive(job: Job) {
    const vendorId = job.data.vendorId;

    const inventoriesToUpdate = await this.inventoryRepository.findAll(
      new QueryOptionsBuilder()
        .filter({
          vendorId: vendorId,
          inventoryStatusId: InventoryStatusEnum.available,
          isDeleted: {
            [Op.is]: null,
          },
        })
        .build(),
    );

    if (inventoriesToUpdate.length > 0) {
      const productIds = [
        ...new Set(inventoriesToUpdate.map((inv) => inv.productId)),
      ];

      await this.inventoryRepository.update(
        { inventoryStatusId: InventoryStatusEnum.suspended },
        {
          where: {
            id: {
              [Op.in]: inventoriesToUpdate.map((p) => p.id),
            },
          },
        },
      );
      for (const productId of productIds) {
        await this.productInventoryStatusQueue.add(
          'updateProductInventoryStatus',
          {
            productId: productId,
          },
        );
      }
    }
  }

  @Process('active')
  async active(job: Job) {
    const vendorId = job.data.vendorId;
    const inventoriesToUpdate = await this.inventoryRepository.findAll(
      new QueryOptionsBuilder()
        .filter({
          vendorId: vendorId,
          inventoryStatusId: InventoryStatusEnum.suspended,
          isDeleted: {
            [Op.is]: null,
          },
        })
        .build(),
    );
    if (inventoriesToUpdate.length > 0) {
      const productIds = [
        ...new Set(inventoriesToUpdate.map((inv) => inv.productId)),
      ];
      await this.inventoryRepository.update(
        { inventoryStatusId: InventoryStatusEnum.available },
        {
          where: {
            id: {
              [Op.in]: inventoriesToUpdate.map((p) => p.id),
            },
          },
        },
      );
      for (const productId of productIds) {
        await this.productInventoryStatusQueue.add(
          'updateProductInventoryStatus',
          {
            productId: productId,
          },
        );
      }
    }
  }
}
