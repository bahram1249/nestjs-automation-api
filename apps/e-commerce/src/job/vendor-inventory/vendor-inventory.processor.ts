import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ECInventory, ECProduct } from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Processor('vendor')
export class VendorInventoryProcessor {
  constructor(
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    @InjectModel(ECProduct)
    private readonly productRepository: typeof ECProduct,
    @InjectQueue('product')
    private readonly productQueue: Queue,
  ) {}

  @Process('deactive')
  async deactive(job: Job) {
    const vendorId = job.data.vendorId;
    await this.inventoryRepository.update(
      { inventoryStatusId: 3 },
      {
        where: {
          vendorId: vendorId,
          inventoryStatusId: 1,
          isDeleted: {
            [Op.is]: null,
          },
        },
      },
    );
    const inventories = await this.inventoryRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ vendorId: vendorId })
        .filter({
          isDeleted: {
            [Op.is]: null,
          },
        })
        .build(),
    );
    for (const inventory of inventories) {
      const job = await this.productRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: inventory.productId })
          .filter({
            isDeleted: {
              [Op.is]: null,
            },
          })
          .build(),
      );
      if (job) {
        await this.productQueue.add('update-inventory-status', {
          productId: inventory.productId,
        });
      }
    }
  }

  @Process('active')
  async active(job: Job) {
    const vendorId = job.data.vendorId;
    await this.inventoryRepository.update(
      { inventoryStatusId: 1 },
      {
        where: {
          vendorId: vendorId,
          inventoryStatusId: 3,
          isDeleted: {
            [Op.is]: null,
          },
        },
      },
    );
    const inventories = await this.inventoryRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ vendorId: vendorId })
        .filter({
          isDeleted: {
            [Op.is]: null,
          },
        })
        .build(),
    );
    for (const inventory of inventories) {
      const job = await this.productRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: inventory.productId })
          .filter({
            isDeleted: {
              [Op.is]: null,
            },
          })
          .build(),
      );
      if (job) {
        await this.productQueue.add('update-inventory-status', {
          productId: inventory.productId,
        });
      }
    }
  }
}
