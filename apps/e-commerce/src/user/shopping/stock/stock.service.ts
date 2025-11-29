import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ECUserSession } from '@rahino/localdatabase/models';
import { StockDto, StockPriceDto } from './dto';
import { ECStock } from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { ProductRepositoryService } from '@rahino/ecommerce/client/product/service/product-repository.service';
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
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { AddressService } from '../../address/address.service';
import { ECProvince } from '@rahino/localdatabase/models';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import { StockPriceService } from './services/price';
import { ShipmentInteface } from './services/shipment-price/interface';
import { ApplyDiscountService } from '@rahino/ecommerce/client/product/service';
import { PaymentServiceManualProviderFactory } from '../payment/provider/factory/payment-service-manual-provider.factory';
import { ValidateAddressService } from '../payment-rule/services/validate-address.service';

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
    private readonly applyDiscountService: ApplyDiscountService,
    private readonly paymentServiceProvider: PaymentServiceManualProviderFactory,
    private readonly validateAddressService: ValidateAddressService,
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
    stocks = JSON.parse(JSON.stringify(stocks));
    if (!stocks || stocks.length === 0) {
      return {
        result: [],
      };
    }

    // Build unique list of productId + inventoryId pairs for batch query
    const uniqueKey = (p: { productId: any; inventoryId: any }) =>
      `${p.productId}_${p.inventoryId}`;
    const pairMap: Record<string, { productId: number; inventoryId: number }> =
      {};
    for (const s of stocks) {
      const key = uniqueKey({
        productId: s.productId,
        inventoryId: s.inventoryId,
      });
      if (!pairMap[key]) {
        pairMap[key] = {
          productId: Number(s.productId),
          inventoryId: Number(s.inventoryId),
        };
      }
    }
    const productInventoryPairs = Object.values(pairMap);

    // Query all products in one shot with their requested inventories
    const filter = _.extend(_.cloneDeep(this.emptyListFilter), {
      productInventoryPairs,
      limit: productInventoryPairs.length,
      offset: 0,
    });
    const productsQuery = await this.productRepositoryService.findAll(
      filter as any,
    );
    const products = productsQuery.result;

    // Index products by id for quick lookup
    const productById = new Map<number, any>();
    for (const p of products) {
      productById.set(Number(p.id), p);
    }

    // Attach product with only the specific inventory to each stock
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index];
      const product = productById.get(Number(stock.productId));
      if (product) {
        // Clone to avoid mutating shared sequelize instance across stocks
        const productPlain = JSON.parse(JSON.stringify(product));
        const matchedInventory = (productPlain.inventories || []).find(
          (inv) => Number(inv.id) === Number(stock.inventoryId),
        );
        productPlain.inventories = matchedInventory ? [matchedInventory] : [];
        stock.product = productPlain;
      }

      stocks[index] = stock;
      if (
        stock?.product?.inventoryStatusId == InventoryStatusEnum.unavailable ||
        (stock?.product?.inventories?.[0]?.qty ?? 0) < stock.qty
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
    const { result: stockResult } = await this.findAll(session);
    // available items
    let stocks = stockResult.filter(
      (stock) =>
        stock.product.inventoryStatusId == InventoryStatusEnum.available &&
        stock.product.inventories[0].qty >= stock.qty,
    );

    // validation on address
    if (query.addressId) {
      await this.validateAddressService.validateAddress({
        addressId: query.addressId,
        stocks: stocks,
        user: user,
      });
    }

    if (query.couponCode) {
      const applitedStocksDiscount =
        await this.applyDiscountService.applyStocksCouponDiscount(
          stocks,
          query.couponCode,
        );
      stocks = applitedStocksDiscount.stocks;

      // const discount = applitedStocksDiscount.discount;
      // const countApplied = applitedStocksDiscount.countApplied;
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
        .reduce((prev, current) => prev + current, 0);
      const totalDiscount = variationPriceStock.stocks
        .map((stock) => stock.discountFee)
        .reduce((prev, current) => prev + current, 0);
      const totalProductPrice = variationPriceStock.stocks
        .map((stock) => stock.totalProductPrice)
        .reduce((prev, current) => prev + current, 0);

      const shipment = await this.shipmentService.cal(
        variationPriceStock.stocks,
        query.addressId,
      );

      let payments = await this.paymentGatewayRepository.findAll(
        new QueryOptionsBuilder()
          .attributes(['id', 'name', 'imageUrl'])
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

      for (let index = 0; index < payments.length; index++) {
        const payment = payments[index];

        const paymentService = await this.paymentServiceProvider.create(
          payment.id,
        );
        const eligbleRequest = await paymentService.eligbleRequest(
          totalPrice + Number(shipment.price),
          user,
        );

        payment.set('eligibleCheck', eligbleRequest.eligibleCheck);
        payment.set('titleMessage', eligbleRequest.titleMessage);
        payment.set('description', eligbleRequest.description);

        payments[index] = payment;
      }

      payments = payments.filter((payment) => payment.eligibleCheck == true);

      resultList.push({
        variationPriceId: variationPriceStock.variationPrice.id,
        variationPriceName: variationPriceStock.variationPrice.name,
        totalProductPrice: totalProductPrice,
        totalDiscount: totalDiscount,
        totalPrice: totalPrice + Number(shipment.price),
        totalShipmentPrice: shipment.price,
        shipmentType: shipment.type,
        shipmentTypeName: shipment.typeName,
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
      _.extend(this.emptyListFilter, { inventoryId: stock.inventoryId }),
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
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
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
