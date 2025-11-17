import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { VENDOR_QUEUE } from './constants';
import { DBLogger } from '@rahino/logger';
import { ECInventory } from '@rahino/localdatabase/models';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';
import { Op, Sequelize } from 'sequelize';
import { InjectQueue } from '@nestjs/bullmq';
import { PRODUCT_INVENTORY_STATUS_QUEUE } from '@rahino/ecommerce/shared/inventory/constants';
import { Queue } from 'bullmq';

@Processor(VENDOR_QUEUE)
export class VendorInventoryProcessor extends WorkerHost {
  constructor(
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    @InjectQueue(PRODUCT_INVENTORY_STATUS_QUEUE)
    private readonly productInventoryStatusQueue: Queue,
    private readonly logger: DBLogger,
  ) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    const vendorId = job.data.vendorId;
    let inventoriesToUpdate: ECInventory[] = [];
    let toStatus: InventoryStatusEnum;
    if (job.name == 'deactive') {
      toStatus = InventoryStatusEnum.suspended;
      inventoriesToUpdate = await this.inventoryRepository.findAll(
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
    } else if (job.name == 'active') {
      toStatus = InventoryStatusEnum.available;
      inventoriesToUpdate = await this.inventoryRepository.findAll(
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
    }
    if (inventoriesToUpdate.length > 0) {
      const productIds = [
        ...new Set(inventoriesToUpdate.map((inv) => inv.productId)),
      ];

      await this.inventoryRepository.update(
        { inventoryStatusId: toStatus },
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
    return Promise.resolve(vendorId);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }
}
