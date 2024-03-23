import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECDiscountCondition } from '@rahino/database/models/ecommerce-eav/ec-discount-condition.entity';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { DiscountActionRuleEnum } from '@rahino/ecommerce/admin/discount-action-rule/enum/discount-action-rule.enum';
import { DiscountConditionTypeEnum } from '@rahino/ecommerce/admin/discount-condition-type/enum';
import { DiscountInterface } from '@rahino/ecommerce/admin/discount/interface';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { RedisRepository } from '@rahino/redis-client';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { DiscountActionTypeEnum } from '@rahino/ecommerce/admin/discount-action-type/enum';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { ConfigService } from '@nestjs/config';
import { ECDiscountType } from '@rahino/database/models/ecommerce-eav/ec-discount-type.entity';
import { parseValue } from '@rahino/commontools/functions/parse-value';

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
      let product = products[index];
      promises.push(this.applyProduct(product));
    }
    return await Promise.all(promises);
  }

  async applyProduct(product: ECProduct) {
    const promises = [];
    for (let index = 0; index < product.inventories.length; index++) {
      let inventory = product.inventories[index];
      promises.push(this.applyInventory(product, inventory));
    }
    product.inventories = await Promise.all(promises);
    return product;
  }

  async applyInventory(product: ECProduct, inventory: ECInventory) {
    // 15 minutes
    const expire = this.config.get<number>('EXPIRE_DISCOUNT') || 900;
    const key = `product:${product.id}::inventory:${inventory.id}`;
    const foundItem = await this.redisRepository.hgetall(key);
    // not yet read it before
    if (Object.keys(foundItem).length === 0) {
      inventory = await this._applyDiscountIfExists(
        product,
        inventory,
        key,
        expire,
      );
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
    let finalDiscountList: ECDiscount[] = Array.from(discounts).sort(
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
        _.merge(discountApplied, { applied: true }),
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
    let discountPrice = 0;
    switch (Number(discountApplied.actionType)) {
      case DiscountActionTypeEnum.percentage:
        discountPrice =
          Number(inventoryPrice.price) * (discountApplied.amount / 100);
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
      maxValue: discountApplied.maxValue,
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
        startDate: discount.startDate,
        endDate: discount.endDate,
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
        startDate: discount.startDate,
        endDate: discount.endDate,
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
        )`.replaceAll(/\s\s+/g, ' '),
          ),
        )
        .build(),
    );
  }
}
