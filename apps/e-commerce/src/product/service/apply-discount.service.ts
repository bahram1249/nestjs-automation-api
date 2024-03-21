import { Injectable } from '@nestjs/common';
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
import { DiscountAppliedInterface } from '@rahino/ecommerce/admin/discount/interface/discount-applied.interface';

@Injectable()
export class ApplyDiscountService {
  constructor(
    @InjectModel(ECDiscount)
    private readonly repository: typeof ECDiscount,
    private readonly redisRepository: RedisRepository,
  ) {}

  async applyProducts(products: ECProduct[]) {
    for (let index = 0; index < products.length; index++) {
      let product = products[index];
      product = await this.applyProduct(product);
      products[index] = product;
    }
    return products;
  }

  async applyProduct(product: ECProduct) {
    for (let index = 0; index < product.inventories.length; index++) {
      let inventory = product.inventories[index];
      inventory = await this.applyInventory(product, inventory);
      product.inventories[index] = inventory;
    }
    return product;
  }

  async applyInventory(product: ECProduct, inventory: ECInventory) {
    // 15 minutes
    const expire = 900;
    const key = `product:${product.id}::inventory:${inventory.id}`;
    const foundItem = await this.redisRepository.hgetall(key);

    // not yet read it before
    if (foundItem == null) {
      inventory = await this._applyDiscountIfExists(
        product,
        inventory,
        key,
        expire,
      );
    }

    let isExists: boolean = null;
    if (foundItem != null) isExists = JSON.parse(foundItem['applied']);

    // if apllied before
    if (isExists == true) {
      const appliedDiscount = foundItem as unknown as DiscountAppliedInterface;
      if (inventory.firstPrice) {
        inventory.firstPrice = await this._applyPrice(
          inventory.firstPrice,
          appliedDiscount,
        );
      }
      if (inventory.secondaryPrice) {
        inventory.secondaryPrice = await this._applyPrice(
          inventory.secondaryPrice,
          appliedDiscount,
        );
      }
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
    const entityTypeDiscounts = await this._getEntityTypeDiscounts(
      product,
      inventory,
    );
    const inventoryDiscounts = await this._getInventoryDiscounts(
      product,
      inventory,
    );
    const productDiscounts = await this._getProductDiscounts(
      product,
      inventory,
    );
    const vendorDiscounts = await this._getVendorDiscounts(product, inventory);

    // distincts this discounts
    const discounts = new Set<ECDiscount>();
    entityTypeDiscounts.forEach((element) => {
      discounts.add(element);
    });
    inventoryDiscounts.forEach((element) => {
      discounts.add(element);
    });
    productDiscounts.forEach((element) => {
      discounts.add(element);
    });
    vendorDiscounts.forEach((element) => {
      discounts.add(element);
    });

    let finalList: ECDiscount[] = [];
    discounts.forEach((discount) => {
      finalList.push(discount);
    });
    // sort based priority
    finalList = finalList.sort((item) => item.priority);
    // applied discounts
    inventory = await this._applyDiscount(
      finalList,
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
    for (let index = 0; index < discounts.length; index++) {
      const discount = discounts[index];
      if (discount.discountActionRuleId == DiscountActionRuleEnum.and) {
        discountApplied = await this._applyAndConditionDiscount(
          product,
          inventory,
          discount,
        );
      } else if (discount.discountActionRuleId == DiscountActionRuleEnum.or) {
        discountApplied = await this._applyOrConditionDiscount(
          product,
          inventory,
          discount,
        );
      }
      if (discountApplied != null) {
        break;
      }
    }
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
      inventory.firstPrice = await this._applyPrice(
        inventory.firstPrice,
        discountApplied,
      );
    }
    if (inventory.secondaryPrice) {
      inventory.secondaryPrice = await this._applyPrice(
        inventory.secondaryPrice,
        discountApplied,
      );
    }
    return inventory;
  }

  private async _applyPrice(
    inventoryPrice: ECInventoryPrice,
    discountApplied: DiscountInterface,
  ) {
    if (discountApplied.actionType == DiscountActionTypeEnum.percentage) {
      let discountPrice =
        Number(inventoryPrice.price) * (discountApplied.amount / 100);
      if (discountPrice > discountApplied.maxValue) {
        discountPrice = discountApplied.maxValue;
      }
      const price = Number(inventoryPrice.price) - discountPrice;

      inventoryPrice.appliedDiscount = {
        id: discountApplied.id,
        amount: discountApplied.amount,
        newPrice: price,
        actionType: discountApplied.actionType,
        maxValue: discountApplied.maxValue,
      };
    } else if (
      discountApplied.actionType == DiscountActionTypeEnum.fixedAmount
    ) {
      let discountPrice = discountApplied.amount;
      if (discountPrice > discountApplied.maxValue) {
        discountPrice = discountApplied.maxValue;
      }
      const price = Number(inventoryPrice.price) - discountPrice;

      inventoryPrice.appliedDiscount = {
        id: discountApplied.id,
        amount: discountApplied.amount,
        newPrice: price,
        actionType: discountApplied.actionType,
        maxValue: discountApplied.maxValue,
      };
    }

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
      if (mainConditionResult != conditionResult) {
        mainConditionResult = false;
        break;
      }
    }
    if (mainConditionResult) {
      discountApplied = {
        id: discount.id,
        amount: discount.discountValue,
        maxValue: discount.maxValue,
        actionType: discount.discountActionTypeId,
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
    const findDefaultCondition = discount.conditions.find(
      (item) => item.isDefault == true,
    );
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
    if (
      condition.conditionTypeId == DiscountConditionTypeEnum.entityType &&
      product.entityTypeId == Number(condition.conditionValue)
    ) {
      conditionResult = true;
    } else if (
      condition.conditionTypeId == DiscountConditionTypeEnum.product &&
      product.id == condition.conditionValue
    ) {
      conditionResult = true;
    } else if (
      condition.conditionTypeId == DiscountConditionTypeEnum.inventory &&
      inventory.id == condition.conditionValue
    ) {
      conditionResult = true;
    } else if (
      condition.conditionTypeId == DiscountConditionTypeEnum.vendor &&
      inventory.vendorId == Number(condition.conditionValue)
    ) {
      conditionResult = true;
    }
    return conditionResult;
  }

  private async _getEntityTypeDiscounts(
    product: ECProduct,
    inventory: ECInventory,
  ) {
    return await this.repository.findAll(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.fn('getdate'), {
            [Op.between]: [
              Sequelize.col('ECDiscount.startDate'),
              Sequelize.col('ECDiscount.endDate'),
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
          Sequelize.literal(` EXISTS (
          SELECT 1
          FROM ECDiscountConditions conditionTbl
          WHERE conditionTbl.discountId = ECDiscount.id
            AND conditionTbl.conditionTypeId = ${DiscountConditionTypeEnum.entityType}
            AND conditionTbl.conditionValue = ${product.entityTypeId}
            AND ISNULL(conditionTbl.isDeleted, 0) = 0
        )`),
        )
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
        ])
        .build(),
    );
  }

  private async _getProductDiscounts(
    product: ECProduct,
    inventory: ECInventory,
  ) {
    return await this.repository.findAll(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.fn('getdate'), {
            [Op.between]: [
              Sequelize.col('ECDiscount.startDate'),
              Sequelize.col('ECDiscount.endDate'),
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
          Sequelize.literal(` EXISTS (
          SELECT 1
          FROM ECDiscountConditions conditionTbl
          WHERE conditionTbl.discountId = ECDiscount.id
            AND conditionTbl.conditionTypeId = ${DiscountConditionTypeEnum.product}
            AND conditionTbl.conditionValue = ${product.id}
            AND ISNULL(conditionTbl.isDeleted, 0) = 0
        )`),
        )
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
        ])
        .build(),
    );
  }

  private async _getInventoryDiscounts(
    product: ECProduct,
    inventory: ECInventory,
  ) {
    return await this.repository.findAll(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.fn('getdate'), {
            [Op.between]: [
              Sequelize.col('ECDiscount.startDate'),
              Sequelize.col('ECDiscount.endDate'),
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
          Sequelize.literal(` EXISTS (
          SELECT 1
          FROM ECDiscountConditions conditionTbl
          WHERE conditionTbl.discountId = ECDiscount.id
            AND conditionTbl.conditionTypeId = ${DiscountConditionTypeEnum.inventory}
            AND conditionTbl.conditionValue = ${inventory.id}
            AND ISNULL(conditionTbl.isDeleted, 0) = 0
        )`),
        )
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
        ])
        .build(),
    );
  }

  private async _getVendorDiscounts(
    product: ECProduct,
    inventory: ECInventory,
  ) {
    return await this.repository.findAll(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.fn('getdate'), {
            [Op.between]: [
              Sequelize.col('ECDiscount.startDate'),
              Sequelize.col('ECDiscount.endDate'),
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
          Sequelize.literal(` EXISTS (
          SELECT 1
          FROM ECDiscountConditions conditionTbl
          WHERE conditionTbl.discountId = ECDiscount.id
            AND conditionTbl.conditionTypeId = ${DiscountConditionTypeEnum.vendor}
            AND conditionTbl.conditionValue = ${inventory.vendorId}
            AND ISNULL(conditionTbl.isDeleted, 0) = 0
        )`),
        )
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
        ])
        .build(),
    );
  }
}
