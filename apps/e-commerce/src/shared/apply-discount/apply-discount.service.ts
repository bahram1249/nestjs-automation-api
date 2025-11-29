import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECDiscountCondition } from '@rahino/localdatabase/models';
import { ECDiscount } from '@rahino/localdatabase/models';
import { ECInventory } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { DiscountActionRuleEnum } from '@rahino/ecommerce/admin/discount-section/discount-action-rule/enum/discount-action-rule.enum';
import { DiscountConditionTypeEnum } from '@rahino/ecommerce/admin/discount-section/discount-condition-type/enum';
import { DiscountInterface } from '@rahino/ecommerce/admin/discount-section/discount/interface';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { RedisRepository } from '@rahino/redis-client';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { DiscountActionTypeEnum } from '@rahino/ecommerce/admin/discount-section/discount-action-type/enum';
import { ECInventoryPrice } from '@rahino/localdatabase/models';
import { ConfigService } from '@nestjs/config';
import { ECDiscountType } from '@rahino/localdatabase/models';
import { parseValue } from '@rahino/commontools/functions/parse-value';
import { ECStock } from '@rahino/localdatabase/models';
import { defaultValueIsNull } from '@rahino/commontools/functions/default-value-isnull';

@Injectable()
export class ApplyDiscountService {
  constructor(
    @InjectModel(ECDiscount)
    private readonly repository: typeof ECDiscount,
    private readonly redisRepository: RedisRepository,
    private readonly config: ConfigService,
  ) {}

  async applyProducts(products: ECProduct[]) {
    const promises = [];
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      promises.push(this.applyProduct(product));
    }
    return await Promise.all(promises);
  }

  async applyProduct(product: ECProduct) {
    const promises = [];
    for (let index = 0; index < product.inventories.length; index++) {
      const inventory = product.inventories[index];
      promises.push(this.applyInventory(product, inventory));
    }
    product.inventories = await Promise.all(promises);
    return product;
  }

  async applyInventory(product: ECProduct, inventory: ECInventory) {
    // 15 minutes
    const expire = this.config.get<number>('EXPIRE_DISCOUNT') || 900;
    const key = `discount::product:${product.id}::inventory:${inventory.id}`;
    const foundItem = await this.redisRepository.hgetall(key);
    // not yet read it before
    if (Object.keys(foundItem).length === 0) {
      inventory = await this._applyDiscountIfExists(
        product,
        inventory,
        key,
        expire,
      );
      return inventory;
    }

    let isExists: boolean = null;
    if (Object.keys(foundItem).length > 0) {
      isExists = JSON.parse(foundItem['applied']);
    }

    let appliedDiscount = null;

    // if apllied before
    if (isExists == true) {
      appliedDiscount = foundItem as unknown as DiscountInterface;
      for (const key in appliedDiscount) {
        appliedDiscount[key] = parseValue(appliedDiscount[key]);
      }

      if (appliedDiscount.maxValue.toString() == '') {
        appliedDiscount.maxValue = null;
      }
      if (appliedDiscount.startDate.toString() == '') {
        appliedDiscount.startDate = new Date();
      }
      if (appliedDiscount.endDate.toString() == '') {
        const oneDay = 24 * 3600 * 1000;
        appliedDiscount.endDate = new Date(Date.now() + oneDay);
      }

      const now = new Date();
      if (appliedDiscount.startDate > now || appliedDiscount.endDate < now) {
        appliedDiscount = null;
      }
    }

    if (inventory.firstPrice) {
      inventory.firstPrice = await this._applyDiscountPrice(
        inventory.firstPrice,
        appliedDiscount,
      );
    }
    if (inventory.secondaryPrice) {
      inventory.secondaryPrice = await this._applyDiscountPrice(
        inventory.secondaryPrice,
        appliedDiscount,
      );
    }

    return inventory;
  }

  private async _applyDiscountIfExists(
    product: ECProduct,
    inventory: ECInventory,
    key: string,
    expire: number,
  ) {
    // find all discounts
    const promises = [
      this._getEntityTypeDiscounts(product, inventory),
      this._getInventoryDiscounts(product, inventory),
      this._getProductDiscounts(product, inventory),
      this._getVendorDiscounts(product, inventory),
    ];

    const promiseResults = await Promise.all(promises);
    const results: ECDiscount[] = [].concat(...promiseResults);

    // distincts these discounts
    const discounts = new Set<ECDiscount>(results);
    const finalDiscountList: ECDiscount[] = Array.from(discounts).sort(
      (item) => item.priority,
    );

    // applied discounts
    inventory = await this._applyDiscount(
      finalDiscountList,
      product,
      inventory,
      key,
      expire,
    );
    return inventory;
  }

  private async _applyDiscount(
    discounts: ECDiscount[],
    product: ECProduct,
    inventory: ECInventory,
    key: string,
    expire: number,
  ) {
    let discountApplied: DiscountInterface = null;

    // check which discount can be applied first & ignore others
    for (let index = 0; index < discounts.length; index++) {
      const discount = discounts[index];

      // find can be applied discount object
      discountApplied = await this._findSingleInventoryDiscount(
        product,
        inventory,
        discount,
      );

      if (discountApplied != null) {
        break;
      }
    }
    // no discount applied
    if (discountApplied == null) {
      await this.redisRepository.hset(key, { applied: false }, expire);
    } else {
      await this.redisRepository.hset(
        key,
        _.merge(JSON.parse(JSON.stringify(discountApplied)), { applied: true }),
        expire,
      );
    }

    if (inventory.firstPrice) {
      inventory.firstPrice = await this._applyDiscountPrice(
        inventory.firstPrice,
        discountApplied,
      );
    }
    if (inventory.secondaryPrice) {
      inventory.secondaryPrice = await this._applyDiscountPrice(
        inventory.secondaryPrice,
        discountApplied,
      );
    }
    return inventory;
  }

  private async _applyDiscountPrice(
    inventoryPrice: ECInventoryPrice,
    discountApplied?: DiscountInterface,
  ) {
    if (discountApplied == null) {
      inventoryPrice.set('appliedDiscount', null);
      return inventoryPrice;
    }
    // if we get elapsed time discounts, only cache !!! not apllied to price
    // but nodejs instance date current time with sql server, They are almost a second apart
    const now = new Date();
    const elapsed = 1;
    now.setSeconds(now.getSeconds() + elapsed);
    if (discountApplied.startDate > now || discountApplied.endDate < now) {
      inventoryPrice.set('appliedDiscount', null);
      return inventoryPrice;
    }
    let discountPrice = 0;
    switch (Number(discountApplied.actionType)) {
      case DiscountActionTypeEnum.percentage:
        discountPrice = Math.round(
          Number(inventoryPrice.price) * (discountApplied.amount / 100),
        );
        break;
      case DiscountActionTypeEnum.fixedAmount:
        discountPrice = discountApplied.amount;
        break;
      default:
        throw new InternalServerErrorException('unknown discountActionType');
    }
    if (
      discountApplied.maxValue != null &&
      discountPrice > discountApplied.maxValue
    ) {
      discountPrice = discountApplied.maxValue;
    }
    const newPrice = Number(inventoryPrice.price) - discountPrice;
    inventoryPrice.set('appliedDiscount', {
      id: discountApplied.id,
      amount: discountApplied.amount,
      newPrice: newPrice,
      actionType: discountApplied.actionType,
      discountTypeId: discountApplied.discountTypeId,
      discountTypeName: discountApplied.discountTypeName,
      maxValue: discountApplied.maxValue,
      startDate: discountApplied.startDate,
      endDate: discountApplied.endDate,
      freeShipment: discountApplied.freeShipment,
    });

    return inventoryPrice;
  }

  private async _applyAndConditionDiscount(
    product: ECProduct,
    inventory: ECInventory,
    discount: ECDiscount,
  ): Promise<DiscountInterface> {
    let discountApplied: DiscountInterface = null;
    let mainConditionResult = true;
    for (let index = 0; index < discount.conditions.length; index++) {
      const condition = discount.conditions[index];
      const conditionResult = await this._checkCondition(
        product,
        inventory,
        condition,
      );
      // virtualize and condition
      if (mainConditionResult != conditionResult) {
        mainConditionResult = false;
        break;
      }
    }
    // if all conditions are pass
    if (mainConditionResult) {
      discountApplied = {
        id: discount.id,
        amount: discount.discountValue,
        maxValue: discount.maxValue,
        actionType: discount.discountActionTypeId,
        discountTypeId: discount.discountActionTypeId,
        discountTypeName: discount.discountType.name,
        startDate: discount.startDate,
        endDate: discount.endDate,
        freeShipment: discount.freeShipment,
      };
    }
    return discountApplied;
  }

  private async _applyOrConditionDiscount(
    product: ECProduct,
    inventory: ECInventory,
    discount: ECDiscount,
  ): Promise<DiscountInterface> {
    let discountApplied: DiscountInterface = null;
    let mainConditionResult = false;

    let defaultConditionResult = false;
    /*
      cause each discount specefied to a vendor
      first we check all conditions against specefied vendor
    */
    const findDefaultCondition = discount.conditions.find(
      (item) => item.isDefault == true,
    );

    /*
     if doesn't exists default Condition, 
     it's meen this condition can be applied to any vendor
    */
    if (findDefaultCondition == null) {
      defaultConditionResult = true;
    } else {
      defaultConditionResult = await this._checkCondition(
        product,
        inventory,
        findDefaultCondition,
      );
    }

    if (defaultConditionResult == false) return discountApplied;

    for (let index = 0; index < discount.conditions.length; index++) {
      const condition = discount.conditions[index];
      const conditionResult = await this._checkCondition(
        product,
        inventory,
        condition,
      );
      if (conditionResult == true && condition != findDefaultCondition) {
        mainConditionResult = true;
        break;
      }
    }
    if (mainConditionResult) {
      discountApplied = {
        id: discount.id,
        actionType: discount.discountActionTypeId,
        amount: discount.discountValue,
        maxValue: discount.maxValue,
        discountTypeId: discount.discountTypeId,
        discountTypeName: discount.discountType.name,
        startDate: discount.startDate,
        endDate: discount.endDate,
        freeShipment: discount.freeShipment,
      };
    }
    return discountApplied;
  }

  private async _checkCondition(
    product: ECProduct,
    inventory: ECInventory,
    condition: ECDiscountCondition,
  ) {
    let conditionResult = false;
    switch (condition.conditionTypeId) {
      case DiscountConditionTypeEnum.entityType:
        conditionResult =
          product.entityTypeId == Number(condition.conditionValue);
        break;
      case DiscountConditionTypeEnum.product:
        conditionResult = product.id == condition.conditionValue;
        break;
      case DiscountConditionTypeEnum.inventory:
        conditionResult = inventory.id == condition.conditionValue;
        break;
      case DiscountConditionTypeEnum.vendor:
        conditionResult =
          inventory.vendorId == Number(condition.conditionValue);
        break;
      default:
        throw new InternalServerErrorException('unknown discountConditionType');
    }

    return conditionResult;
  }

  private async _getEntityTypeDiscounts(
    product: ECProduct,
    inventory: ECInventory,
  ) {
    return await this._getDiscountByConditionType(
      DiscountConditionTypeEnum.entityType,
      product.entityTypeId,
    );
  }

  private async _getProductDiscounts(
    product: ECProduct,
    inventory: ECInventory,
  ) {
    return await this._getDiscountByConditionType(
      DiscountConditionTypeEnum.product,
      product.id,
    );
  }

  private async _getInventoryDiscounts(
    product: ECProduct,
    inventory: ECInventory,
  ) {
    return await this._getDiscountByConditionType(
      DiscountConditionTypeEnum.inventory,
      inventory.id,
    );
  }

  private async _getVendorDiscounts(
    product: ECProduct,
    inventory: ECInventory,
  ) {
    return await this._getDiscountByConditionType(
      DiscountConditionTypeEnum.vendor,
      inventory.vendorId,
    );
  }

  private async _getDiscountByConditionType(
    conditionType: DiscountConditionTypeEnum,
    value: any,
  ) {
    return await this.repository.findAll(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'description',
          'discountTypeId',
          'discountActionTypeId',
          'discountValue',
          'maxValue',
          'discountActionRuleId',
          'userId',
          'priority',
          'limit',
          'used',
          'isActive',
          'isDeleted',
          [
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECDiscount.startDate'),
              Sequelize.fn('getdate'),
            ),
            'startDate',
          ],
          [
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECDiscount.endDate'),
              Sequelize.fn(
                'dateadd',
                Sequelize.literal('day'),
                Sequelize.literal('1'),
                Sequelize.fn('getdate'),
              ),
            ),
            'endDate',
          ],
          'couponCode',
          'freeShipment',
          'createdAt',
          'updatedAt',
        ])
        .include([
          {
            model: ECDiscountCondition,
            as: 'conditions',
            required: true,
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('conditions.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          },
          {
            model: ECDiscountType,
            as: 'discountType',
            required: true,
          },
        ])
        .filter(
          Sequelize.where(Sequelize.fn('getdate'), {
            [Op.between]: [
              Sequelize.fn(
                'dateadd',
                Sequelize.literal('minute'),
                Sequelize.literal('-16'),
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('ECDiscount.startDate'),
                  Sequelize.fn('getdate'),
                ),
              ),
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECDiscount.endDate'),
                Sequelize.fn('getdate'),
              ),
            ],
          }),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECDiscount.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECDiscount.isActive'), 0),
            {
              [Op.eq]: 1,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('discountType.isCouponBased'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('discountType.isFactorBased'),
              0,
            ),
            {
              [Op.ne]: 1,
            },
          ),
        )
        // has one releated condition to this given product or inventory
        .filter(
          Sequelize.literal(
            ` EXISTS (
          SELECT 1
          FROM ECDiscountConditions conditionTbl
          WHERE conditionTbl.discountId = ECDiscount.id
            AND conditionTbl.conditionTypeId = ${conditionType}
            AND conditionTbl.conditionValue = ${value}
            AND ISNULL(conditionTbl.isDeleted, 0) = 0
            AND ISNULL(conditionTbl.isDefault, 0) = 0
        )`.replaceAll(/\s\s+/g, ' '),
          ),
        )
        .build(),
    );
  }

  public async applyStocksCouponDiscount(
    stocks: ECStock[],
    couponCode: string,
  ) {
    const discount = await this.findDiscountByCouponCode(couponCode);
    if (!discount) {
      throw new BadRequestException('کد تخفیفی یافت نشد');
    }
    const result = await this._canApplyCouponDiscount(stocks, discount);
    return {
      stocks: result.stocks,
      discount: discount,
      countApplied: result.appliedItem,
    };
  }

  private async _canApplyCouponDiscount(
    stocks: ECStock[],
    discount: ECDiscount,
  ) {
    const available =
      defaultValueIsNull(discount.limit, 0) -
      defaultValueIsNull(discount.used, 0);
    if (discount.limit != null && available <= 0) {
      throw new BadRequestException('مجاز به استفاده از این کد تخفیف نیستید');
    }
    const promises = [];
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index];
      promises.push(this._applyStockCoponDiscount(stock, discount));
    }
    const results = await Promise.all(promises);
    const stocksEdited: ECStock[] = results.map((results) => results.stock);
    const appliedItem: number = results
      .map((results) => results.countApllied)
      .reduce((prev, current) => prev + current, 0);
    if (appliedItem == 0) {
      throw new BadRequestException(
        'کد تخفیفی برای کالای های مورد نظر یافت نشد',
      );
    }
    if (appliedItem > available && discount.limit != null) {
      throw new BadRequestException(
        'میزان استفاده از این کد تخفیف به اتمام رسیده است',
      );
    }
    return { stocks: stocksEdited, appliedItem };
  }

  private async _applyStockCoponDiscount(stock: ECStock, discount: ECDiscount) {
    // quantity of applied
    let countApllied = 0;
    const { inventory, applied } = await this._applyCopunCodeToInventory(
      stock.product,
      stock.product.inventories[0],
      discount,
    );

    if (applied) {
      // set count of applied
      countApllied = stock.qty;
    }
    stock.product.inventories[0] = inventory;
    return { stock: stock, countApllied: countApllied };
  }

  public async _applyCopunCodeToInventory(
    product: ECProduct,
    inventory: ECInventory,
    discount: ECDiscount,
  ) {
    let applied = false;
    const discountInterface = await this._findSingleInventoryDiscount(
      product,
      inventory,
      discount,
    );

    // if discount founded set for inventories
    if (discountInterface) {
      applied = true;
      if (inventory.firstPrice) {
        inventory.firstPrice = await this._applyDiscountPrice(
          inventory.firstPrice,
          discountInterface,
        );
      }
      if (inventory.secondaryPrice) {
        inventory.secondaryPrice = await this._applyDiscountPrice(
          inventory.secondaryPrice,
          discountInterface,
        );
      }
    }
    return { inventory, applied };
  }

  public async _findSingleInventoryDiscount(
    product: ECProduct,
    inventory: ECInventory,
    discount: ECDiscount,
  ) {
    let discountApplied: DiscountInterface = null;
    switch (discount.discountActionRuleId) {
      case DiscountActionRuleEnum.and:
        discountApplied = await this._applyAndConditionDiscount(
          product,
          inventory,
          discount,
        );
        break;
      case DiscountActionRuleEnum.or:
        discountApplied = await this._applyOrConditionDiscount(
          product,
          inventory,
          discount,
        );
        break;
      default:
        throw new InternalServerErrorException('unknown discountActionRule');
    }
    return discountApplied;
  }

  public async findDiscountByCouponCode(couponCode: string) {
    return await this.repository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: ECDiscountCondition,
            as: 'conditions',
            required: true,
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('conditions.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          },
          {
            model: ECDiscountType,
            as: 'discountType',
            required: true,
          },
        ])
        .filter(
          Sequelize.where(Sequelize.fn('getdate'), {
            [Op.between]: [
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECDiscount.startDate'),
                Sequelize.fn('getdate'),
              ),
              Sequelize.fn(
                'dateadd',
                Sequelize.literal('minute'),
                Sequelize.literal('15'),
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('ECDiscount.endDate'),
                  Sequelize.fn('getdate'),
                ),
              ),
            ],
          }),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECDiscount.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECDiscount.isActive'), 0),
            {
              [Op.eq]: 1,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('discountType.isCouponBased'),
              0,
            ),
            {
              [Op.eq]: 1,
            },
          ),
        )
        .filter({ couponCode: couponCode })
        .build(),
    );
  }
}
