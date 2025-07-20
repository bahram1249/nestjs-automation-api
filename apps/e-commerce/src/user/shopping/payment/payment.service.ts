import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@rahino/database';
import { ECUserSession } from '@rahino/localdatabase/models';
import { StockPaymentDto, WalletPaymentDto } from './dto';
import { ECOMMERCE_PAYMENT_PROVIDER_TOKEN } from './provider/constants';
import { PayInterface } from './provider/interface';
import { StockService } from '../stock/stock.service';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';
import { AddressService } from '../../address/address.service';
import { ECProvince } from '@rahino/localdatabase/models';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import {
  StockPriceService,
  VariationStockInterface,
} from '../stock/services/price';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { Op, Sequelize, Transaction } from 'sequelize';
import { ShipmentInteface } from '../stock/services/shipment-price/interface';
import {
  OrderDetailStatusEnum,
  OrderShipmentwayEnum,
  OrderStatusEnum,
  PaymentTypeEnum,
  ProvinceEnum,
  VendorCommissionTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import { ECOrder } from '@rahino/localdatabase/models';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { ECStock } from '@rahino/localdatabase/models';
import {
  REVERT_INVENTORY_QTY_JOB,
  REVERT_INVENTORY_QTY_QUEUE,
} from '@rahino/ecommerce/shared/inventory/constants';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { DecreaseInventoryService } from '@rahino/ecommerce/shared/inventory/services';
import { ApplyDiscountService } from '@rahino/ecommerce/client/product/service';
import { ECInventoryPrice } from '@rahino/localdatabase/models';
import { ECVendorCommission } from '@rahino/localdatabase/models';
import * as moment from 'moment-jalaali';
import {
  REVERT_PAYMENT_JOB,
  REVERT_PAYMENT_QUEUE,
} from './revert-payment/revert-payment.constants';
import { CityEnum } from '@rahino/ecommerce/shared/enum/city.enum';
import { ValidateAddressService } from '../payment-rule/services/validate-address.service';

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
    // @InjectQueue(DECREASE_INVENTORY_QUEUE)
    // private readonly decreaseInventoryQueue: Queue,
    @InjectQueue(REVERT_INVENTORY_QTY_QUEUE)
    private readonly revertInventoryQueue: Queue,
    @InjectQueue(REVERT_PAYMENT_QUEUE)
    private readonly revertPaymentQueue: Queue,
    private readonly config: ConfigService,
    private readonly decreaseInventoryService: DecreaseInventoryService,
    private readonly applyDiscountService: ApplyDiscountService,
    @InjectModel(ECInventoryPrice)
    private readonly inventoryPriceRepository: typeof ECInventoryPrice,
    @InjectModel(ECVendorCommission)
    private readonly vendorCommissionRepository: typeof ECVendorCommission,
    private readonly validateAddressService: ValidateAddressService,
  ) {}

  async stock(session: ECUserSession, body: StockPaymentDto, user: User) {
    const stockResult = (await this.stockService.findAll(session)).result;
    // available items
    let stocks = stockResult.filter(
      (stock) =>
        stock.product.inventoryStatusId == InventoryStatusEnum.available &&
        stock.product.inventories[0].qty >= stock.qty,
    );

    if (stocks.length == 0) {
      throw new BadRequestException('cannot find stocks');
    }

    await this.validateAddressService.validateAddress({
      addressId: body.addressId,
      stocks: stocks,
      user: user,
    });

    // discount
    if (body.couponCode) {
      const applitedStocksDiscount =
        await this.applyDiscountService.applyStocksCouponDiscount(
          stocks,
          body.couponCode,
        );
      stocks = applitedStocksDiscount.stocks;
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
      .reduce((prev, current) => prev + current, 0);
    const totalDiscount = variationPriceStock.stocks
      .map((stock) => (stock.discountFee ? stock.discountFee : 0))
      .reduce((prev, current) => prev + current, 0);
    const totalProductPrice = variationPriceStock.stocks
      .map((stock) => stock.totalProductPrice)
      .reduce((prev, current) => prev + current, 0);
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
        shipment.realShipmentPrice,
        shipment.type,
        session.id,
        user.id,
        body.addressId,
        body.noteDescription,
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
        totalDiscount,
        shipment.price,
        user,
        PaymentTypeEnum.ForOrder,
        transaction,
        order.id,
        orderDetails,
      );
      redirectUrl = res.redirectUrl;

      // set stocks to purchase
      await this.purchaseStocks(stocks, transaction);

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
          attempts: 100,
          backoff: {
            type: 'exponential',
            delay: 60000,
          },
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
    realShipmentPrice: number,
    shipmentWay: OrderShipmentwayEnum,
    sessionId: string,
    userId: bigint,
    addressId: bigint,
    noteDescription?: string,
    transaction?: Transaction,
  ) {
    const order = await this.orderRepository.create(
      {
        // total base product base multiple by qty
        totalProductPrice: totalProductPrice,
        totalDiscountFee: totalDiscount,
        totalShipmentPrice: totalShipmentPrice,
        realShipmentPrice: realShipmentPrice,
        orderShipmentWayId: shipmentWay,
        // total price after discount and multiple by qty + shipment
        totalPrice: totalPrice + totalShipmentPrice,
        orderStatusId: OrderStatusEnum.WaitingForPayment,
        sessionId: sessionId,
        userId: userId,
        addressId: addressId,
        noteDescription: noteDescription,
        gregorianAtPersian: moment()
          .tz('Asia/Tehran', false)
          .locale('en')
          .format('YYYY-MM-DD HH:mm:ss'),
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
      const inventoryPrice = await this.inventoryPriceRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: stock.inventoryPriceId })
          .transaction(transaction)
          .build(),
      );
      const vendorCommission = await this.vendorCommissionRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ vendorId: stock.vendorId })
          .filter({ variationPriceId: inventoryPrice.variationPriceId })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECVendorCommission.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .transaction(transaction)
          .build(),
      );
      let commissionAmount: number;
      if (
        vendorCommission.commissionTypeId ==
        VendorCommissionTypeEnum.byPercentage
      ) {
        commissionAmount =
          (stock.totalPrice * Number(vendorCommission.amount)) / 100;
      } else if (
        vendorCommission.commissionTypeId == VendorCommissionTypeEnum.byAmount
      ) {
        commissionAmount = Number(vendorCommission.amount);
      }
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
          discountFeePerItem: stock.discountFeePerItem,
          discountFee: stock.discountFee,
          discountId: stock.discountId,
          totalPrice: stock.totalPrice,
          commissionAmount: commissionAmount,
          vendorCommissionId: vendorCommission.id,
          userId: user.id,
          gregorianAtPersian: moment()
            .tz('Asia/Tehran', false)
            .locale('en')
            .format('YYYY-MM-DD HH:mm:ss'),
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

  async walletCharging(user: User, body: WalletPaymentDto) {
    const payment = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ eligibleChargeWallet: true })
        .filter({ id: body.paymentId })
        .build(),
    );
    if (!payment) {
      throw new BadRequestException(
        "this payment gateway isn't eligble for charging wallet",
      );
    }
    const result = await this.paymentProviderService.requestPayment(
      body.amount,
      0,
      0,
      user,
      PaymentTypeEnum.TopUpWallet,
    );

    const hour = 1;
    const now = new Date();
    const targetTime = new Date().setTime(
      now.getTime() + hour * 60 * 60 * 1000,
    );
    const delay = Number(targetTime) - Number(new Date());

    this.revertPaymentQueue.add(
      REVERT_PAYMENT_JOB,
      {
        paymentId: result.paymentId,
      },
      {
        removeOnComplete: true,
        attempts: 100,
        backoff: {
          type: 'exponential',
          delay: 60000,
        },
        delay: delay,
      },
    );

    return {
      result: {
        redirectUrl: result.redirectUrl,
      },
    };
  }
}
