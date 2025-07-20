import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Setting, User } from '@rahino/database';
import {
  EAVEntityType,
  ECAddress,
  ECInventoryPrice,
  ECOrder,
  ECOrderDetail,
  ECProduct,
  ECShoppingCart,
  ECUserSession,
  ECVendorCommission,
} from '@rahino/localdatabase/models';
import {
  SingleVendorShoppingCreateOrderDetailDto,
  SingleVendorShoppingCreateOrderDto,
  SingleVendorShoppingPaymentDto,
  VendorDistanceDto,
} from './dto';
import { SingleVendorShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { ECOMMERCE_SINGLE_VENDOR_PAYMENT_PROVIDER_TOKEN } from '../payment-provider/constants';
import { SingleVendorPayInterface } from '../payment-provider/interface';
import { AddressService } from '@rahino/ecommerce/user/address/address.service';
import { FormatShoppingCartProductOutputDto } from '../shopping-cart/dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes, Sequelize, Transaction } from 'sequelize';
import { NEARBY_SHOPPING_KM } from '@rahino/ecommerce/shared/constants';
import { LocalizationService } from 'apps/main/src/common/localization';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { CourierPriceEnum } from '@rahino/ecommerce/admin/order-section/courier-price/enum';
import {
  OrderDetailStatusEnum,
  OrderShipmentwayEnum,
  OrderStatusEnum,
  PaymentTypeEnum,
  VendorCommissionTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import * as moment from 'moment-jalaali';
import { DecreaseInventoryService } from '@rahino/ecommerce/shared/inventory/services';
import {
  REVERT_INVENTORY_QTY_JOB,
  REVERT_INVENTORY_QTY_QUEUE,
} from '@rahino/ecommerce/shared/inventory/constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SingleVendorPaymentService {
  private readonly distanceMeters = NEARBY_SHOPPING_KM * 1000;
  constructor(
    private readonly shoppingCartService: SingleVendorShoppingCartService,
    @Inject(ECOMMERCE_SINGLE_VENDOR_PAYMENT_PROVIDER_TOKEN)
    private readonly paymentProviderService: SingleVendorPayInterface,
    private readonly addressService: AddressService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly localizationService: LocalizationService,
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
    @InjectModel(ECOrder)
    private readonly orderRepository: typeof ECOrder,
    @InjectModel(ECOrderDetail)
    private readonly orderDetailRepository: typeof ECOrderDetail,
    @InjectModel(ECInventoryPrice)
    private readonly inventoryPriceRepository: typeof ECInventoryPrice,
    @InjectModel(ECVendorCommission)
    private readonly vendorCommissionRepository: typeof ECVendorCommission,
    @InjectModel(ECShoppingCart)
    private readonly shoppingCartRepository: typeof ECShoppingCart,
    private readonly decreaseInventoryService: DecreaseInventoryService,
    @InjectQueue(REVERT_INVENTORY_QTY_QUEUE)
    private readonly revertInventoryQueue: Queue,
  ) {}

  async shoppingPayment(
    session: ECUserSession,
    body: SingleVendorShoppingPaymentDto,
    user: User,
  ) {
    // get shopping cart products and apply coupon discount
    const shoppingCartProducts =
      await this.shoppingCartService.getShoppingCartElements(
        {
          shoppingCartId: body.shoppingCartId,
          couponCode: body.couponCode,
        },
        session,
      );

    // at least must to have one products that available
    if (shoppingCartProducts.length == 0) {
      throw new BadRequestException('cannot find shopping carts');
    }

    // validate the address for this user
    const addressResult = await this.validateAndReturnAddress(
      user,
      body.addressId,
    );

    // validate address by vendor address
    const vendor = await this.validateAndReturnChoosenVendorByAddress(
      shoppingCartProducts,
      addressResult.result,
    );

    // calculate shipping price
    const totalShippingPrice = await this.calculateShippingCost(vendor);

    // calculate total price of products

    const priceSummary =
      this.shoppingCartService.calculatePriceSummary(shoppingCartProducts);

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });
    let redirectUrl = '';

    try {
      // create order
      const order = await this.createOrder({
        addressId: body.addressId,
        realShipmentPrice: totalShippingPrice,
        totalShipmentPrice: totalShippingPrice,
        sessionId: session.id,
        shipmentWay: OrderShipmentwayEnum.delivery,
        totalDiscount: priceSummary.totalDiscount,
        totalPrice: priceSummary.totalPrice,
        totalProductPrice: priceSummary.totalProductPrice,
        userId: user.id,
        noteDescription: body.noteDescription,
        transaction: transaction,
      });

      // create order details

      await this.createOrderDetail({
        order: order,
        products: shoppingCartProducts,
        transaction: transaction,
        user: user,
      });

      // request payment
      const paymentRes = await this.paymentProviderService.requestPayment({
        convertToRial: true,
        discountAmount: priceSummary.totalDiscount,
        paymentType: PaymentTypeEnum.ForOrder,
        shipmentAmount: totalShippingPrice,
        totalPrice: priceSummary.totalPrice + totalShippingPrice,
        user: user,
        orderId: order.id,
        transaction: transaction,
      });
      redirectUrl = paymentRes.redirectUrl;

      // decrease qty by payment
      await this.decreaseInventoryService.decreaseByPayment(
        paymentRes.paymentId,
        transaction,
      );

      // set shopping cart to  purchase
      await this.purchaseShoppingCart(body.shoppingCartId, transaction);

      // revert inventory qty after one hour if there is no payment
      await this.revertInventoryQtyJob(paymentRes.paymentId);

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
    // redirect to payment
  }

  private async revertInventoryQtyJob(paymentId: bigint) {
    const hour = 1;
    const now = new Date();
    const targetTime = new Date().setTime(
      now.getTime() + hour * 60 * 60 * 1000,
    );
    const delay = Number(targetTime) - Number(new Date());

    this.revertInventoryQueue.add(
      REVERT_INVENTORY_QTY_JOB,
      {
        paymentId: paymentId,
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
  }

  private async purchaseShoppingCart(
    shoppingCartId: bigint,
    transaction: Transaction,
  ) {
    await this.shoppingCartRepository.update(
      {
        isPurchase: true,
      },
      {
        where: {
          id: shoppingCartId,
        },
        transaction: transaction,
      },
    );
  }

  private async createOrder(dto: SingleVendorShoppingCreateOrderDto) {
    return await this.orderRepository.create(
      {
        // total base product base multiple by qty
        totalProductPrice: dto.totalProductPrice,
        totalDiscountFee: dto.totalDiscount,
        totalShipmentPrice: dto.totalShipmentPrice,
        realShipmentPrice: dto.realShipmentPrice,
        orderShipmentWayId: dto.shipmentWay,
        // total price after discount and multiple by qty + shipment
        totalPrice: dto.totalPrice + dto.totalShipmentPrice,
        orderStatusId: OrderStatusEnum.WaitingForPayment,
        sessionId: dto.sessionId,
        userId: dto.userId,
        addressId: dto.addressId,
        noteDescription: dto.noteDescription,
        gregorianAtPersian: moment()
          .tz('Asia/Tehran', false)
          .locale('en')
          .format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        transaction: dto.transaction,
      },
    );
  }

  private async createOrderDetail(
    dto: SingleVendorShoppingCreateOrderDetailDto,
  ) {
    const orderDetails: ECOrderDetail[] = [];
    for (let index = 0; index < dto.products.length; index++) {
      const shoppingCartProduct = dto.products[index];
      const inventoryPrice = await this.inventoryPriceRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: shoppingCartProduct.inventoryPriceId })
          .transaction(dto.transaction)
          .build(),
      );
      const vendorCommission = await this.vendorCommissionRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ vendorId: shoppingCartProduct.vendorId })
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
          .transaction(dto.transaction)
          .build(),
      );
      let commissionAmount: number;
      if (
        vendorCommission.commissionTypeId ==
        VendorCommissionTypeEnum.byPercentage
      ) {
        commissionAmount =
          (shoppingCartProduct.totalPrice * Number(vendorCommission.amount)) /
          100;
      } else if (
        vendorCommission.commissionTypeId == VendorCommissionTypeEnum.byAmount
      ) {
        commissionAmount = Number(vendorCommission.amount);
      }
      let orderDetail = await this.orderDetailRepository.create(
        {
          orderId: dto.order.id,
          orderDetailStatusId: OrderDetailStatusEnum.WaitingForProcess,
          vendorId: shoppingCartProduct.vendorId,
          productId: shoppingCartProduct.productId,
          inventoryId: shoppingCartProduct.inventoryId,
          inventoryPriceId: shoppingCartProduct.inventoryPriceId,
          // stockId: shoppingCartProduct.stockId,
          qty: shoppingCartProduct.qty,
          productPrice: shoppingCartProduct.basePrice,
          discountFeePerItem: shoppingCartProduct.discountFeePerItem,
          discountFee: shoppingCartProduct.discountFee,
          discountId: shoppingCartProduct.discountId,
          totalPrice: shoppingCartProduct.totalPrice,
          commissionAmount: commissionAmount,
          vendorCommissionId: vendorCommission.id,
          userId: dto.user.id,
          gregorianAtPersian: moment()
            .tz('Asia/Tehran', false)
            .locale('en')
            .format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          transaction: dto.transaction,
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
          .transaction(dto.transaction)
          .build(),
      );
      orderDetails.push(orderDetail);
    }
    return orderDetails;
  }

  private async validateAndReturnAddress(user: User, addressId: bigint) {
    return await this.addressService.findById(user, addressId);
  }

  private async validateAndReturnChoosenVendorByAddress(
    products: FormatShoppingCartProductOutputDto[],
    address: ECAddress,
  ) {
    const vendorId = products[0].vendorId;
    const vendor = await this.getVendorWithDistance(
      vendorId,
      address.latitude,
      address.longitude,
    );

    const distanceInMeters = vendor.distanceInMeters;
    if (distanceInMeters / 1000 > NEARBY_SHOPPING_KM) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_vendor_you_choose_is_not_in_valid_area',
        ),
      );
    }

    return vendor;
  }

  private async getVendorWithDistance(
    vendorId: number,
    latitude: string,
    longitude: string,
  ) {
    const vendors = await this.sequelize.query<VendorDistanceDto>(
      `SELECT 
        id, 
        name, 
        coordinates.STDistance(geography::Point(:latitude, :longitude, 4326)) AS distanceInMeters
       FROM ECVendors
       WHERE id = :vendorId`,
      {
        replacements: { latitude, longitude, vendorId },
        type: QueryTypes.SELECT,
      },
    );
    return vendors[0];
  }

  private async calculateShippingCost(vendor: VendorDistanceDto) {
    const [basePrice, pricePerKm] = await Promise.all([
      this.getSettingValue(CourierPriceEnum.BASE_COURIER_PRICE),
      this.getSettingValue(CourierPriceEnum.COURIER_PRICE_BY_KILOMETRE),
    ]);

    const km = Math.round(vendor.distanceInMeters / 1000);
    const totalShipmentPrice = Number(basePrice) + km * Number(pricePerKm);
    return totalShipmentPrice;
  }

  private async getSettingValue(key: string): Promise<string> {
    const setting = await this.settingRepository.findOne(
      new QueryOptionsBuilder().filter({ key }).build(),
    );
    return setting.value;
  }
}
