import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@rahino/database/models/core/user.entity';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { StockPaymentDto } from './dto';
import { ECOMMERCE_PAYMENT_PROVIDER_TOKEN } from './provider/constants';
import { PayInterface } from './provider/interface';
import { StockService } from '../stock/stock.service';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';
import { AddressService } from '../address/address.service';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import {
  StockPriceService,
  VariationStockInterface,
} from '../stock/services/price';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { Op, Sequelize, Transaction } from 'sequelize';
import { ShipmentInteface } from '../stock/services/shipment-price/interface';
import {
  OrderDetailStatusEnum,
  OrderShipmentwayEnum,
  OrderStatusEnum,
  PaymentTypeEnum,
} from '@rahino/ecommerce/util/enum';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { ECStock } from '@rahino/database/models/ecommerce-eav/ec-stocks.entity';
import {
  DECREASE_INVENTORY_JOB,
  DECREASE_INVENTORY_QUEUE,
  REVERT_INVENTORY_QTY_JOB,
  REVERT_INVENTORY_QTY_QUEUE,
} from '@rahino/ecommerce/inventory/constants';
import { Queue, QueueEvents, Job } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { DecreaseInventoryService } from '@rahino/ecommerce/inventory/services';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(ECOMMERCE_PAYMENT_PROVIDER_TOKEN)
    private readonly paymentProviderService: PayInterface,
    private readonly stockService: StockService,
    private readonly addressService: AddressService,
    @InjectModel(ECProvince)
    private readonly provinceRepository: typeof ECProvince,
    @InjectModel(ECVariationPrice)
    private readonly variationPriceRepository: typeof ECVariationPrice,
    private readonly stockPriceService: StockPriceService,
    @InjectModel(ECPaymentGateway)
    private readonly paymentGatewayRepository: typeof ECPaymentGateway,
    @Inject('SHIPMENT_SERVICE')
    private readonly shipmentService: ShipmentInteface,
    @InjectModel(ECOrder)
    private readonly orderRepository: typeof ECOrder,
    @InjectModel(ECOrderDetail)
    private readonly orderDetailRepository: typeof ECOrderDetail,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectModel(ECStock)
    private readonly stockRepository: ECStock,
    @InjectQueue(DECREASE_INVENTORY_QUEUE)
    private readonly decreaseInventoryQueue: Queue,
    @InjectQueue(REVERT_INVENTORY_QTY_QUEUE)
    private readonly revertInventoryQueue: Queue,
    private readonly config: ConfigService,
    private readonly decreaseInventoryService: DecreaseInventoryService,
  ) {}

  async stock(session: ECUserSession, body: StockPaymentDto, user: User) {
    const stockResult = (await this.stockService.findAll(session)).result;
    // available items
    const stocks = stockResult.filter(
      (stock) =>
        stock.product.inventoryStatusId == InventoryStatusEnum.available &&
        stock.product.inventories[0].qty >= stock.qty,
    );

    if (stocks.length == 0) {
      throw new BadRequestException('cannot find stocks');
    }
    // validation of address ... next refactor this piece of code
    const findAddress = (
      await this.addressService.findById(user, body.addressId)
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

    const variationPrices = await this.variationPriceRepository.findAll(
      new QueryOptionsBuilder().filter({ id: body.variationPriceId }).build(),
    );
    const variationPriceStocks =
      await this.stockPriceService.calByVariationPrices(
        stocks,
        variationPrices,
        body.couponCode,
      );
    if (variationPriceStocks.length == 0) {
      throw new BadRequestException('invalid payment');
    }

    const variationPriceStock = variationPriceStocks[0];
    const shipment = await this.shipmentService.cal(
      variationPriceStock.stocks,
      body.addressId,
    );

    const totalPrice = variationPriceStock.stocks
      .map((stock) => stock.totalPrice)
      .reduce((prev, current) => prev + current);
    const totalDiscount = variationPriceStock.stocks
      .map((stock) => stock.discountFee)
      .reduce((prev, current) => prev + current);
    const totalProductPrice = variationPriceStock.stocks
      .map((stock) => stock.totalProductPrice)
      .reduce((prev, current) => prev + current);
    const paymentGateway = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'name'])
        .filter({ variationPriceId: variationPriceStock.variationPrice.id })
        .filter({ id: body.paymentId })
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
    if (!paymentGateway) {
      throw new BadRequestException('invalid paymentId');
    }
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });
    let redirectUrl = '';
    try {
      // create order
      const order = await this.createOrder(
        totalPrice,
        totalDiscount,
        totalProductPrice,
        shipment.price,
        shipment.type,
        session.id,
        user.id,
        body.addressId,
        transaction,
      );
      // create order details
      const orderDetails = await this.createOrderDetails(
        order,
        variationPriceStock,
        user,
        transaction,
      );

      // create payment token from provider of payments
      const res = await this.paymentProviderService.requestPayment(
        totalPrice + shipment.price,
        user,
        PaymentTypeEnum.ForOrder,
        transaction,
        order.id,
        orderDetails,
      );
      redirectUrl = res.redirectUrl;

      // set stocks to purchase
      await this.purchaseStocks(stocks, transaction);

      // decrease inventories
      // const job = await this.decreaseInventoryQueue.add(
      //   DECREASE_INVENTORY_JOB,
      //   {
      //     paymentId: res.paymentId,
      //     transaction: transaction,
      //   },
      //   {
      //     attempts: 1,
      //     removeOnComplete: 500,
      //   },
      // );
      // const result = await job.waitUntilFinished(
      //   new QueueEvents(DECREASE_INVENTORY_QUEUE, {
      //     connection: {
      //       host: this.config.get<string>('REDIS_ADDRESS'),
      //       port: this.config.get<number>('REDIS_PORT'),
      //       password: this.config.get<string>('REDIS_PASSWORD'),
      //     },
      //   }),
      //   5000,
      // );
      // const finishedJob = await Job.fromId(this.decreaseInventoryQueue, job.id);

      await this.decreaseInventoryService.decreaseByPayment(
        res.paymentId,
        transaction,
      );

      // revert inventory qty after one hour if there is no payment
      const hour = 1;
      const now = new Date();
      const targetTime = new Date().setTime(
        now.getTime() + hour * 60 * 60 * 1000,
      );
      const delay = Number(targetTime) - Number(new Date());

      this.revertInventoryQueue.add(
        REVERT_INVENTORY_QTY_JOB,
        {
          paymentId: res.paymentId,
        },
        {
          removeOnComplete: true,
          delay: delay,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }

    return {
      result: {
        redirectUrl: redirectUrl,
      },
    };
  }

  private async purchaseStocks(stocks: ECStock[], transaction: Transaction) {
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index];
      await this.stockRepository.update(
        { isPurchase: true },
        {
          where: {
            id: stock.id,
          },
          transaction: transaction,
        },
      );
    }
  }

  private async createOrder(
    totalPrice: number,
    totalDiscount: number,
    totalProductPrice: number,
    totalShipmentPrice: number,
    shipmentWay: OrderShipmentwayEnum,
    sessionId: string,
    userId: bigint,
    addressId: bigint,
    transaction?: Transaction,
  ) {
    const order = await this.orderRepository.create(
      {
        totalProductPrice: totalProductPrice,
        totalDiscountFee: totalDiscount,
        totalShipmentPrice: totalShipmentPrice,
        orderShipmentWayId: shipmentWay,
        totalPrice: totalPrice + totalShipmentPrice,
        orderStatusId: OrderStatusEnum.WaitingForPayment,
        sessionId: sessionId,
        userId: userId,
        addressId: addressId,
      },
      {
        transaction: transaction,
      },
    );
    return order;
  }

  private async createOrderDetails(
    order: ECOrder,
    variationStock: VariationStockInterface,
    user: User,
    transaction?: Transaction,
  ) {
    const orderDetails: ECOrderDetail[] = [];
    for (let index = 0; index < variationStock.stocks.length; index++) {
      const stock = variationStock.stocks[index];
      let orderDetail = await this.orderDetailRepository.create(
        {
          orderId: order.id,
          orderDetailStatusId: OrderDetailStatusEnum.WaitingForProcess,
          vendorId: stock.vendorId,
          productId: stock.productId,
          inventoryId: stock.inventoryId,
          inventoryPriceId: stock.inventoryPriceId,
          stockId: stock.stockId,
          qty: stock.qty,
          productPrice: stock.basePrice,
          discountFee: stock.discountFee,
          discountId: stock.discountId,
          totalPrice: stock.totalPrice,
          userId: user.id,
        },
        {
          transaction: transaction,
        },
      );
      orderDetail = await this.orderDetailRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: orderDetail.id })
          .include([
            {
              model: ECProduct,
              as: 'product',
              include: [
                {
                  model: EAVEntityType,
                  as: 'entityType',
                },
              ],
            },
          ])
          .transaction(transaction)
          .build(),
      );
      orderDetails.push(orderDetail);
    }
    return orderDetails;
  }
}
