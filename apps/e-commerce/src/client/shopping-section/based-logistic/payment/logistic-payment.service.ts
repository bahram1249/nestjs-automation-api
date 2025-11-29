import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import {
  ECInventoryPrice,
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
  ECProduct,
  ECStock,
  ECVendorCommission,
  ECVariationPrice,
  EAVEntityType,
  ECUserSession,
  ECPaymentGateway,
} from '@rahino/localdatabase/models';
import {
  LogisticStockPaymentDto,
  LogisticPaymentRequestResult,
} from './dto/logistic-payment.dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import {
  OrderDetailStatusEnum,
  OrderStatusEnum,
  PaymentTypeEnum,
  VendorCommissionTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import { ClientShipmentPriceService } from '../shipment-price/shipment-price.service';
import { ApplyDiscountService } from '@rahino/ecommerce/client/product/service';
import { StockService } from '@rahino/ecommerce/user/shopping/stock/stock.service';
import {
  StockPriceService,
  VariationStockInterface,
} from '@rahino/ecommerce/user/shopping/stock/services/price';
import { AddressService } from '@rahino/ecommerce/user/address/address.service';
import { ClientValidateAddressService } from '../validate-address/client-validate-address.service';
import { LOGISTIC_PAYMENT_PROVIDER_TOKEN } from './provider/constants';
import { LogisticPayInterface } from './provider/interface/logistic-pay.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
// Removed legacy inventory revert queue; logistic flow uses a dedicated revert-payment processor
import {
  LOGISTIC_REVERT_PAYMENT_JOB,
  LOGISTIC_REVERT_PAYMENT_QUEUE,
} from './revert-payment/revert-payment.constants';
import * as moment from 'moment-jalaali';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';
import { LogisticPeriodService } from '../logistic-period/logistic-period.service';
import { LogisticDecreaseInventoryQtyService } from '../inventory/services/logistic-decrease-inventory-qty.service';

@Injectable()
export class LogisticPaymentService {
  constructor(
    private readonly clientShipmentPriceService: ClientShipmentPriceService,
    private readonly applyDiscountService: ApplyDiscountService,
    private readonly stockService: StockService,
    private readonly stockPriceService: StockPriceService,
    private readonly addressService: AddressService,
    private readonly clientValidateAddressService: ClientValidateAddressService,
    @Inject(LOGISTIC_PAYMENT_PROVIDER_TOKEN)
    private readonly paymentProviderService: LogisticPayInterface,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectModel(ECStock)
    private readonly stockRepository: typeof ECStock,
    @InjectModel(ECVariationPrice)
    private readonly variationPriceRepository: typeof ECVariationPrice,
    @InjectModel(ECPaymentGateway)
    private readonly paymentGatewayRepository: typeof ECPaymentGateway,
    @InjectModel(ECInventoryPrice)
    private readonly inventoryPriceRepository: typeof ECInventoryPrice,
    @InjectModel(ECLogisticOrder)
    private readonly logisticOrderRepository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly logisticOrderGroupedRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(ECLogisticOrderGroupedDetail)
    private readonly logisticOrderGroupedDetailRepository: typeof ECLogisticOrderGroupedDetail,
    @InjectModel(ECVendorCommission)
    private readonly vendorCommissionRepository: typeof ECVendorCommission,
    @InjectQueue(LOGISTIC_REVERT_PAYMENT_QUEUE)
    private readonly revertPaymentQueue: Queue,
    private readonly l10n: LocalizationService,
    private readonly logisticPeriodService: LogisticPeriodService,
    private readonly logisticDecreaseInventoryQtyService: LogisticDecreaseInventoryQtyService,
  ) {}

  async stock(
    session: ECUserSession,
    body: LogisticStockPaymentDto,
    user: User,
  ): Promise<LogisticPaymentRequestResult> {
    // 1) Load and validate stocks
    let stocks = await this.getValidSessionStocks(session);
    await this.validateAddress(user, body.addressId, stocks);
    stocks = await this.applyCouponIfAny(stocks, body.couponCode);

    // 1.1) Validate groups and stockIds presence
    if (
      !body.groups ||
      !Array.isArray(body.groups) ||
      body.groups.length === 0
    ) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_groups_no_stocks'),
      );
    }
    for (const g of body.groups) {
      if (!Array.isArray(g.stockIds) || g.stockIds.length === 0) {
        throw new BadRequestException(
          this.l10n.translate('ecommerce.invalid_groups_no_stocks'),
        );
      }
      if (
        g.weeklyPeriodTimeId != null &&
        (g.sendingDate == null || String(g.sendingDate).trim() === '')
      ) {
        throw new BadRequestException(
          this.l10n.translate(
            'ecommerce.sending_date_required_when_time_selected',
          ),
        );
      }
    }

    // 2) Build variation context and validate groups
    const variationPriceStock = await this.calcVariationPriceStock(
      stocks,
      body.variationPriceId,
      body.couponCode,
    );
    this.validateGroupsAgainstStocks(body.groups, variationPriceStock);

    // 2.1) Optional: validate provided sendingDate against logistic period availability
    await this.validateSendingDates(
      user,
      session,
      body.addressId as any,
      body.groups,
    );

    // 3) Shipment pricing
    const pricingGroups = this.buildPricingGroups(
      body.groups,
      variationPriceStock,
    );
    const shipmentPricing = await this.clientShipmentPriceService.calSelections(
      pricingGroups as any,
      body.addressId,
    );

    // 4) Totals and gateway validation
    const {
      totalPriceProducts,
      totalDiscount,
      totalShipment,
      totalRealShipment,
      totalPayable,
    } = this.computeTotals(variationPriceStock, shipmentPricing);
    await this.validatePaymentGateway(
      variationPriceStock.variationPrice.id,
      body.paymentId,
    );

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });

    try {
      // 5) Create order and groups
      const order = await this.createOrder(
        session,
        user,
        body,
        {
          totalPriceProducts,
          totalDiscount,
          totalShipment,
          totalRealShipment,
        },
        transaction,
      );
      const { groupMap, groupTotals } = await this.createGroupedOrders(
        order.id,
        body.groups,
        transaction,
      );
      this.fillShipmentTotals(groupTotals, shipmentPricing);

      // 6) Persist details and update group totals
      const allGroupedDetails = await this.persistDetails(
        body.groups,
        variationPriceStock,
        groupMap,
        groupTotals,
        user,
        transaction,
      );
      await this.updateGroupedTotals(groupMap, groupTotals, transaction);

      // 7) Request payment and finalize async revert
      const pay = await this.paymentProviderService.requestPayment(
        totalPayable,
        totalDiscount,
        totalShipment,
        user,
        PaymentTypeEnum.ForOrder,
        transaction,
        order.id,
        allGroupedDetails,
      );
      await this.purchaseStocks(variationPriceStock.stocks, transaction);
      await this.logisticDecreaseInventoryQtyService.decreaseByPayment(
        pay.paymentId,
        transaction,
      );
      await this.enqueueRevertIfUnpaid(pay.paymentId);

      await transaction.commit();
      return { redirectUrl: pay.redirectUrl };
    } catch (e) {
      await transaction.rollback();
      console.log(e);
      throw new InternalServerErrorException(
        this.l10n.translate('ecommerce.payment_request_failed', {
          message: e.message,
        }),
      );
    }
  }

  // region: helpers
  private async getValidSessionStocks(session: ECUserSession) {
    const { result: stockResult } = await this.stockService.findAll(session);
    const stocks = stockResult.filter(
      (stock) =>
        stock.product.inventoryStatusId != null &&
        stock.product.inventories[0].qty >= stock.qty,
    );
    if (stocks.length === 0) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.cannot_find_stocks'),
      );
    }
    return stocks;
  }

  /**
   * Validates if the given address is valid for the given stocks
   *
   * @param user - The user that is making the payment
   * @param addressId - The id of the address to check
   * @param stocks - The array of stocks that the user is trying to purchase
   * @throws BadRequestException if the address is not valid for the given stocks
   */
  private async validateAddress(user: User, addressId: bigint, stocks: any[]) {
    const { result: userAddress } = await this.addressService.findById(
      user,
      addressId,
    );
    await this.clientValidateAddressService.paymentValidateAddress({
      address: userAddress,
      stocks,
    });
  }

  private async applyCouponIfAny(stocks: any[], couponCode?: string) {
    if (!couponCode) return stocks;
    const applied = await this.applyDiscountService.applyStocksCouponDiscount(
      stocks,
      couponCode,
    );
    return applied.stocks;
  }

  private async calcVariationPriceStock(
    stocks: any[],
    variationPriceId: bigint,
    couponCode?: string,
  ) {
    const variationPrices = await this.variationPriceRepository.findAll(
      new QueryOptionsBuilder().filter({ id: variationPriceId }).build(),
    );
    const variationPriceStocks =
      await this.stockPriceService.calByVariationPrices(
        stocks,
        variationPrices,
        couponCode,
      );
    if (variationPriceStocks.length === 0) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.invalid_payment'),
      );
    }
    return variationPriceStocks[0];
  }

  private validateGroupsAgainstStocks(groups: any[], variationPriceStock: any) {
    const validStockIds = new Set(
      variationPriceStock.stocks.map((s) => String(s.stockId)),
    );
    for (const g of groups) {
      for (const stockId of g.stockIds) {
        if (stockId == null || !validStockIds.has(String(stockId))) {
          throw new BadRequestException(
            this.l10n.translate('ecommerce.invalid_groups_unknown_stock_id'),
          );
        }
      }
    }
  }

  private buildPricingGroups(groups: any[], variationPriceStock: any) {
    return groups.map((g) => {
      const stocks = g.stockIds.map((id) => {
        const s = variationPriceStock.stocks.find(
          (vs) => String(vs.stockId) === String(id),
        );
        return {
          stockId: s.stockId,
          qty: s.qty,
          totalPrice: s.totalPrice,
          // Ensure weight is provided for shipment pricing (e.g., post service)
          weight: s.weight,
          // Preserve free-shipment flags for discount rules in pricing services
          freeShipment: s.freeShipment,
        } as any;
      });
      return { ...g, stocks } as any;
    });
  }

  private computeTotals(variationPriceStock: any, shipmentPricing: any) {
    const totalPriceProducts = variationPriceStock.stocks
      .map((s) => s.totalProductPrice)
      .reduce((a, b) => a + b, 0);
    const totalDiscount = variationPriceStock.stocks
      .map((s) => (s.discountFee ? s.discountFee : 0))
      .reduce((a, b) => a + b, 0);
    const totalShipment = Number(shipmentPricing.totalPrice || 0);
    const totalRealShipment = Number(
      shipmentPricing.totalRealShipmentPrice || 0,
    );
    const totalPayable =
      variationPriceStock.stocks
        .map((s) => s.totalPrice)
        .reduce((a, b) => a + b, 0) + totalShipment;
    return {
      totalPriceProducts,
      totalDiscount,
      totalShipment,
      totalRealShipment,
      totalPayable,
    };
  }

  private async validatePaymentGateway(
    variationPriceId: number | bigint,
    paymentId: number | bigint,
  ) {
    const paymentGateway = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'name'])
        .filter({ variationPriceId })
        .filter({ id: paymentId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECPaymentGateway.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );
    if (!paymentGateway) throw new BadRequestException('invalid paymentId');
  }

  private async createOrder(
    session: ECUserSession,
    user: User,
    body: LogisticStockPaymentDto,
    totals: {
      totalPriceProducts: number;
      totalDiscount: number;
      totalShipment: number;
      totalRealShipment: number;
    },
    transaction: Transaction,
  ) {
    return this.logisticOrderRepository.create(
      {
        totalProductPrice: totals.totalPriceProducts,
        totalDiscountFee: totals.totalDiscount,
        totalShipmentPrice: totals.totalShipment,
        realShipmentPrice: totals.totalRealShipment,
        totalPrice:
          totals.totalPriceProducts -
          totals.totalDiscount +
          totals.totalShipment,
        orderStatusId: OrderStatusEnum.WaitingForPayment,
        sessionId: session.id,
        userId: user.id,
        addressId: body.addressId,
        noteDescription: body.noteDescription,
        gregorianAtPersian: moment()
          .tz('Asia/Tehran', false)
          .locale('en')
          .format('YYYY-MM-DD HH:mm:ss'),
      },
      { transaction },
    );
  }

  private async createGroupedOrders(
    orderId: bigint,
    groups: any[],
    transaction: Transaction,
  ) {
    const groupMap: Record<string, ECLogisticOrderGrouped> = {};
    for (const g of groups) {
      const grp = await this.logisticOrderGroupedRepository.create(
        {
          logisticOrderId: orderId,
          logisticId: g.logisticId as any,
          logisticShipmentWayId: g.shipmentWayId as any,
          orderShipmentWayId: g.shipmentWayType as any,
          logisticSendingPeriodId: (g.sendingPeriodId as any) ?? null,
          logisticWeeklyPeriodId: (g.weeklyPeriodId as any) ?? null,
          logisticWeeklyPeriodTimeId: (g.weeklyPeriodTimeId as any) ?? null,
          sendingGregorianDate: g.sendingDate ? new Date(g.sendingDate) : null,
          orderStatusId: OrderStatusEnum.WaitingForPayment,
          totalProductPrice: 0,
          totalDiscountFee: 0,
          shipmentPrice: 0,
          realShipmentPrice: 0,
          totalPrice: 0,
        },
        { transaction },
      );
      groupMap[
        `${g.logisticId}:${g.shipmentWayId}:${g.sendingPeriodId ?? 'n'}:${
          g.weeklyPeriodId ?? 'n'
        }:${g.weeklyPeriodTimeId ?? 'n'}`
      ] = grp;
    }
    const groupTotals: Record<
      string,
      {
        product: number;
        discount: number;
        shipment: number;
        realShipment: number;
        total: number;
      }
    > = {};
    for (const g of groups) {
      const grpKey = `${g.logisticId}:${g.shipmentWayId}:${
        g.sendingPeriodId ?? 'n'
      }:${g.weeklyPeriodId ?? 'n'}:${g.weeklyPeriodTimeId ?? 'n'}`;
      groupTotals[grpKey] = {
        product: 0,
        discount: 0,
        shipment: 0,
        realShipment: 0,
        total: 0,
      };
    }
    return { groupMap, groupTotals };
  }

  private async validateSendingDates(
    user: User,
    session: ECUserSession,
    addressId: number,
    groups: any[],
  ) {
    const { result } = await this.logisticPeriodService.getDeliveryOptions(
      user,
      session,
      { addressId } as any,
    );

    const dateEq = (a: Date | string, b: Date | string) => {
      const da = new Date(a);
      const db = new Date(b);
      return da.toDateString() === db.toDateString();
    };

    for (const g of groups) {
      if (!g.sendingDate) continue; // nothing to validate

      const targetGroup = ((result as any[]) || []).find(
        (rg: any) => Number(rg.logisticId) === Number(g.logisticId),
      );
      if (!targetGroup) {
        throw new BadRequestException('invalid sending date group');
      }

      let ok = false;
      for (const so of targetGroup.sendingOptions || []) {
        for (const way of so.shipmentWays || []) {
          if (Number(way.shipmentWayId) !== Number(g.shipmentWayId)) continue;
          for (const pd of way.possibleDates || []) {
            if (!dateEq(pd.gregorianDate, g.sendingDate)) continue;
            const times = pd.times || [];
            if (g.weeklyPeriodTimeId) {
              const hasTime = times.some(
                (t: any) =>
                  Number(t.weeklyPeriodTimeId) ===
                    Number(g.weeklyPeriodTimeId) &&
                  (g.sendingPeriodId
                    ? Number(t.sendingPeriodId) === Number(g.sendingPeriodId)
                    : true) &&
                  (g.weeklyPeriodId
                    ? Number(t.weeklyPeriodId) === Number(g.weeklyPeriodId)
                    : true),
              );
              if (hasTime) {
                ok = true;
                break;
              }
            } else {
              // no specific time required; having any time on this date is accepted
              if (times.length > 0) {
                ok = true;
                break;
              }
            }
          }
          if (ok) break;
        }
        if (ok) break;
      }

      if (!ok) {
        throw new BadRequestException('invalid sending date');
      }
    }
  }

  private fillShipmentTotals(
    groupTotals: Record<string, any>,
    shipmentPricing: any,
  ) {
    for (const priced of shipmentPricing.groups) {
      const k = `${priced.logisticId}:${priced.shipmentWayId}:${
        priced.sendingPeriodId ?? 'n'
      }:${priced.weeklyPeriodId ?? 'n'}:${priced.weeklyPeriodTimeId ?? 'n'}`;
      if (groupTotals[k]) {
        groupTotals[k].shipment = Number(priced.price || 0);
        groupTotals[k].realShipment = Number(priced.realShipmentPrice || 0);
      }
    }
  }

  private async persistDetails(
    groups: any[],
    variationPriceStock: any,
    groupMap: Record<string, ECLogisticOrderGrouped>,
    groupTotals: Record<string, any>,
    user: User,
    transaction: Transaction,
  ) {
    const allGroupedDetails = [] as ECLogisticOrderGroupedDetail[];
    for (const g of groups) {
      const grpKey = `${g.logisticId}:${g.shipmentWayId}:${
        g.sendingPeriodId ?? 'n'
      }:${g.weeklyPeriodId ?? 'n'}:${g.weeklyPeriodTimeId ?? 'n'}`;
      const grp = groupMap[grpKey];
      for (const stockId of g.stockIds) {
        const s = variationPriceStock.stocks.find(
          (vs) => String(vs.stockId) === String(stockId),
        );
        if (!s) throw new BadRequestException('invalid stock in group');

        const inventoryPrice = await this.inventoryPriceRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ id: s.inventoryPriceId })
            .transaction(transaction)
            .build(),
        );
        const vendorCommission = await this.vendorCommissionRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ vendorId: s.vendorId })
            .filter({ variationPriceId: inventoryPrice.variationPriceId })
            .filter(
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('ECVendorCommission.isDeleted'),
                  0,
                ),
                { [Op.eq]: 0 },
              ),
            )
            .transaction(transaction)
            .build(),
        );

        let commissionAmount = 0;
        if (vendorCommission) {
          if (
            vendorCommission.commissionTypeId ===
            VendorCommissionTypeEnum.byPercentage
          ) {
            commissionAmount =
              (s.totalPrice * Number(vendorCommission.amount)) / 100;
          } else if (
            vendorCommission.commissionTypeId ===
            VendorCommissionTypeEnum.byAmount
          ) {
            commissionAmount = Number(vendorCommission.amount);
          }
        }

        const detail = await this.logisticOrderGroupedDetailRepository.create(
          {
            groupedId: grp.id,
            orderDetailStatusId: OrderDetailStatusEnum.WaitingForProcess,
            vendorId: s.vendorId,
            productId: s.productId,
            inventoryId: s.inventoryId,
            inventoryPriceId: s.inventoryPriceId,
            stockId: s.stockId as any,
            qty: s.qty,
            productPrice: s.basePrice,
            discountFeePerItem: s.discountFeePerItem,
            discountFee: s.discountFee,
            discountId: s.discountId as any,
            totalPrice: s.totalPrice,
            commissionAmount,
            vendorCommissionId: vendorCommission?.id as any,
            userId: user.id,
            gregorianAtPersian: moment()
              .tz('Asia/Tehran', false)
              .locale('en')
              .format('YYYY-MM-DD HH:mm:ss'),
          },
          { transaction },
        );

        groupTotals[grpKey].product += Number(s.totalProductPrice || 0);
        groupTotals[grpKey].discount += Number(s.discountFee || 0);
        allGroupedDetails.push(detail);
      }
    }
    return allGroupedDetails;
  }

  private async updateGroupedTotals(
    groupMap: Record<string, ECLogisticOrderGrouped>,
    groupTotals: Record<
      string,
      {
        product: number;
        discount: number;
        shipment: number;
        realShipment: number;
        total: number;
      }
    >,
    transaction: Transaction,
  ) {
    for (const key of Object.keys(groupTotals)) {
      const grp = groupMap[key];
      const t = groupTotals[key];
      await this.logisticOrderGroupedRepository.update(
        {
          totalProductPrice: t.product,
          totalDiscountFee: t.discount,
          shipmentPrice: t.shipment,
          realShipmentPrice: t.realShipment,
          totalPrice: t.product - t.discount + t.shipment,
        },
        { where: { id: grp.id }, transaction },
      );
    }
  }

  private async enqueueRevertIfUnpaid(paymentId: bigint) {
    const hour = 1;
    const now = new Date();
    const delay = now.getTime() + hour * 60 * 60 * 1000 - Date.now();
    await this.revertPaymentQueue.add(
      LOGISTIC_REVERT_PAYMENT_JOB,
      { paymentId },
      {
        attempts: 100,
        backoff: { type: 'exponential', delay: 60000 },
        removeOnComplete: true,
        delay,
      },
    );
  }
  // endregion

  private async purchaseStocks(
    stocks: VariationStockInterface['stocks'],
    transaction: Transaction,
  ) {
    for (const s of stocks) {
      await this.stockRepository.update(
        { isPurchase: true },
        { where: { id: s.stockId as any }, transaction },
      );
    }
  }
}
