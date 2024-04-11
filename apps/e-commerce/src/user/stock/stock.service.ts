import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { StockDto, StockPriceDto } from './dto';
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
  STOCK_INVENTORY_UPDATE_JOB,
  STOCK_INVENTORY_UPDATE_QUEUE,
} from './constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueEvents } from 'bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { AddressService } from '../address/address.service';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { StockPriceService } from './services/price';
import { PostShipmentPriceService } from './services/shipment-price/post-shipment-price.service';
import { ShipmentInteface } from './services/shipment-price/interface';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(ECStock)
    private readonly repository: typeof ECStock,
    @InjectModel(ECPaymentGateway)
    private readonly paymentGatewayRepository: typeof ECPaymentGateway,
    @Inject(emptyListFilter)
    private readonly emptyListFilter: ListFilter,
    private readonly productRepositoryService: ProductRepositoryService,
    private readonly config: ConfigService,
    @InjectQueue(STOCK_INVENTORY_QUEUE)
    private readonly stockInventoryQueue: Queue,
    @InjectQueue(STOCK_INVENTORY_REMOVE_QUEUE)
    private readonly stockInventoryRemoveQueue: Queue,
    @InjectQueue(STOCK_INVENTORY_UPDATE_QUEUE)
    private readonly stockInventoryUpdateQueue: Queue,
    private readonly addressService: AddressService,
    @InjectModel(ECProvince)
    private readonly provinceRepository: typeof ECProvince,
    @InjectModel(ECVariationPrice)
    private readonly variationPriceRepository: typeof ECVariationPrice,
    private readonly priceService: StockPriceService,
    @Inject('SHIPMENT_SERVICE')
    private readonly shipmentService: ShipmentInteface,
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
      if (
        stock.product.inventoryStatusId == InventoryStatusEnum.unavailable ||
        stock.product.inventories[0].qty < stock.qty
      ) {
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

  async price(session: ECUserSession, query: StockPriceDto, user?: User) {
    const stockResult = (await this.findAll(session)).result;
    // available items
    const stocks = stockResult.filter(
      (stock) =>
        stock.product.inventoryStatusId == InventoryStatusEnum.available &&
        stock.product.inventories[0].qty >= stock.qty,
    );

    // validation on address
    if (query.addressId) {
      const findAddress = (
        await this.addressService.findById(user, query.addressId)
      ).result;
      for (let index = 0; index < stocks.length; index++) {
        const stock = stocks[index];
        if (
          stock.product.inventories[0].onlyProvinceId != null &&
          stock.product.inventories[0].onlyProvinceId != findAddress.provinceId
        ) {
          const province = await this.provinceRepository.findOne(
            new QueryOptionsBuilder()
              .filter({
                id: stock.product.inventories[0].onlyProvinceId,
              })
              .build(),
          );
          throw new BadRequestException(
            `${stock.product.title} فقط مجوز ارسال به استان ${province.name} را دارد.`,
          );
        }
      }
    }

    const variationPrices = await this.variationPriceRepository.findAll();

    const variationPriceStocks = await this.priceService.calByVariationPrices(
      stocks,
      variationPrices,
      query.couponCode,
    );

    const resultList = [];
    for (let index = 0; index < variationPriceStocks.length; index++) {
      const variationPriceStock = variationPriceStocks[index];
      const totalPrice = variationPriceStock.stocks
        .map((stock) => stock.totalPrice)
        .reduce((prev, current) => prev + current);
      const totalDiscount = variationPriceStock.stocks
        .map((stock) => stock.discountFee)
        .reduce((prev, current) => prev + current);
      const totalProductPrice = variationPriceStock.stocks
        .map((stock) => stock.totalProductPrice)
        .reduce((prev, current) => prev + current);
      const payments = await this.paymentGatewayRepository.findAll(
        new QueryOptionsBuilder()
          .attributes(['id', 'name'])
          .filter({ variationPriceId: variationPriceStock.variationPrice.id })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECPaymentGateway.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      const totalShipmentPrice = await this.shipmentService.cal(
        variationPriceStock.stocks,
        query.addressId,
      );
      resultList.push({
        variationPriceId: variationPriceStock.variationPrice.id,
        variationPriceName: variationPriceStock.variationPrice.name,
        totalProductPrice: totalProductPrice,
        totalDiscount: totalDiscount,
        totalPrice: totalPrice + Number(totalShipmentPrice),
        totalShipmentPrice: totalShipmentPrice,
        payments: payments,
      });
    }

    // this is end of new

    return {
      result: {
        paymentOptions: resultList,
        stocks: stocks,
        couponCode: query.couponCode,
        addressId: query.addressId,
      },
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

  async update(session: ECUserSession, dto: StockDto) {
    const stock = await this.repository.findOne(
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
    if (!stock) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    const job = await this.stockInventoryUpdateQueue.add(
      STOCK_INVENTORY_UPDATE_JOB,
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
        new QueueEvents(STOCK_INVENTORY_UPDATE_QUEUE, {
          connection: {
            host: this.config.get<string>('REDIS_ADDRESS'),
            port: this.config.get<number>('REDIS_PORT'),
            password: this.config.get<string>('REDIS_PASSWORD'),
          },
        }),
        5000,
      );
      const finishedJob = await Job.fromId(
        this.stockInventoryUpdateQueue,
        job.id,
      );
      return {
        result: finishedJob.returnvalue,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
