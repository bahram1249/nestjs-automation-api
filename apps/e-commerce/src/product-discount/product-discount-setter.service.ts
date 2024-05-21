import { ECDiscountCondition } from '@rahino/database/models/ecommerce-eav/ec-discount-condition.entity';
import { ECDiscountType } from '@rahino/database/models/ecommerce-eav/ec-discount-type.entity';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { DiscountConditionTypeEnum } from '../admin/discount-condition-type/enum';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { InjectModel } from '@nestjs/sequelize';
import { DiscountInterface } from '../admin/discount/interface';
import { ApplyDiscountService } from '../product/service';

export class ProductDiscountSetterService {
  constructor(
    @InjectModel(ECDiscount)
    private readonly discountRepository: typeof ECDiscount,
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    private readonly applyDiscountService: ApplyDiscountService,
  ) {}
  async applyProducts(products: ECProduct[]) {
    const promises = [];
    for (let index = 0; index < products.length; index++) {
      let product = products[index];
      promises.push(this.applyProduct(product));
    }
    return await Promise.all(promises);
  }
  async applyProduct(product: ECProduct): Promise<ECProduct> {
    const promises = [];
    for (let index = 0; index < product.inventories.length; index++) {
      let inventory = product.inventories[index];
      promises.push(this.applyInventory(product, inventory));
    }
    await Promise.all(promises);
    return product;
  }

  async applyInventory(product: ECProduct, inventory: ECInventory) {
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

    let discountApplied: DiscountInterface = null;

    // check which discount can be applied first & ignore others
    for (let index = 0; index < finalDiscountList.length; index++) {
      const discount = finalDiscountList[index];

      // find can be applied discount object
      discountApplied =
        await this.applyDiscountService._findSingleInventoryDiscount(
          product,
          inventory,
          discount,
        );

      if (discountApplied != null) {
        break;
      }
    }

    if (discountApplied == null && inventory.discountTypeId != null) {
      await this.inventoryRepository.update(
        {
          discountStartDate: null,
          discountEndDate: null,
          discountTypeId: null,
        },
        {
          where: {
            id: inventory.id,
          },
        },
      );
      return inventory;
    } else if (discountApplied == null && inventory.discountTypeId == null) {
      return inventory;
    }

    await this.inventoryRepository.update(
      {
        discountStartDate: discountApplied.startDate,
        discountEndDate: discountApplied.endDate,
        discountTypeId: discountApplied.discountTypeId,
      },
      {
        where: {
          id: inventory.id,
        },
      },
    );

    return inventory;
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
    return await this.discountRepository.findAll(
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
          'startDate',
          'endDate',
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
                'isnull',
                Sequelize.col('ECDiscount.startDate'),
                Sequelize.fn('getdate'),
              ),
              Sequelize.fn(
                'dateadd',
                Sequelize.literal('day'),
                Sequelize.literal('1'),
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
            AND ISNULL(conditionTbl.isDefault, 0) = 0
        )`.replaceAll(/\s\s+/g, ' '),
          ),
        )
        .build(),
    );
  }
}
