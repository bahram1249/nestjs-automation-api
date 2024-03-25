import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { StockDto } from './dto';
import { ECStock } from '@rahino/database/models/ecommerce-eav/ec-stocks.entity';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { ProductRepositoryService } from '@rahino/ecommerce/product/service/product-repository.service';
import { emptyListFilter } from '@rahino/query-filter/provider/constants';
import { ListFilter } from '@rahino/query-filter';
import * as _ from 'lodash';
import {
  STOCK_INVENTORY_JOB,
  STOCK_INVENTORY_QUEUE,
  STOCK_INVENTORY_REMOVE_JOB,
  STOCK_INVENTORY_REMOVE_QUEUE,
} from './constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueEvents } from 'bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(ECStock)
    private readonly repository: typeof ECStock,
    @Inject(emptyListFilter)
    private readonly emptyListFilter: ListFilter,
    private readonly productRepositoryService: ProductRepositoryService,
    @InjectQueue(STOCK_INVENTORY_QUEUE)
    private readonly stockInventoryQueue: Queue,
    @InjectQueue(STOCK_INVENTORY_REMOVE_QUEUE)
    private readonly stockInventoryRemoveQueue: Queue,
    private readonly config: ConfigService,
  ) {}

  async findAll(session: ECUserSession) {
    let stocks = await this.repository.findAll(
      new QueryOptionsBuilder()
        .attributes(['id', 'inventoryId', 'productId', 'qty'])
        .filter({ sessionId: session.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          expire: {
            [Op.gt]: Sequelize.fn('getdate'),
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isPurchase'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index];
      const queryItem = await this.productRepositoryService.findById(
        _.merge(this.emptyListFilter, { inventoryId: stock.inventoryId }),
        stock.productId,
      );
      stock.set('product', queryItem.result);
      stocks[index] = stock;
      if (stock.product.inventoryStatusId == InventoryStatusEnum.unavailable) {
        await this.stockInventoryRemoveQueue.add(STOCK_INVENTORY_REMOVE_JOB, {
          stockId: stock.id,
        });
      }
    }
    return {
      result: stocks,
    };
  }

  async count(session: ECUserSession) {
    const count = await this.repository.count(
      new QueryOptionsBuilder()
        .filter({ sessionId: session.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          expire: {
            [Op.gt]: Sequelize.fn('getdate'),
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isPurchase'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    return {
      result: count,
    };
  }

  async findById(session: ECUserSession, entityId: bigint) {
    const stock = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'inventoryId', 'productId', 'qty'])
        .filter({ id: entityId })
        .filter({ sessionId: session.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          expire: {
            [Op.gt]: Sequelize.fn('getdate'),
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isPurchase'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!stock) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    const queryItem = await this.productRepositoryService.findById(
      _.merge(this.emptyListFilter, { inventoryId: stock.inventoryId }),
      stock.productId,
    );
    stock.set('product', queryItem.result);

    if (stock.product.inventoryStatusId == InventoryStatusEnum.unavailable) {
      await this.stockInventoryRemoveQueue.add(STOCK_INVENTORY_REMOVE_JOB, {
        stockId: stock.id,
      });
    }

    return {
      result: stock,
    };
  }

  async create(session: ECUserSession, dto: StockDto) {
    const job = await this.stockInventoryQueue.add(
      STOCK_INVENTORY_JOB,
      {
        session,
        dto,
      },
      {
        attempts: 1,
        removeOnComplete: 500,
      },
    );
    try {
      const result = await job.waitUntilFinished(
        new QueueEvents(STOCK_INVENTORY_QUEUE, {
          connection: {
            host: this.config.get<string>('REDIS_ADDRESS'),
            port: this.config.get<number>('REDIS_PORT'),
            password: this.config.get<string>('REDIS_PASSWORD'),
          },
        }),
        5000,
      );
      const finishedJob = await Job.fromId(this.stockInventoryQueue, job.id);
      return {
        result: finishedJob.returnvalue,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteById(session: ECUserSession, entityId: bigint) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'inventoryId', 'productId', 'qty'])
        .filter({ id: entityId })
        .filter({ sessionId: session.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          expire: {
            [Op.gt]: Sequelize.fn('getdate'),
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isPurchase'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    item.isDeleted = true;
    await item.save();
    return {
      result: item,
    };
  }
}
