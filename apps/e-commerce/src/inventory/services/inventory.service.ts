import { Injectable } from '@nestjs/common';
import { InventoryDto } from '../dto';
import { Sequelize, Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { User } from '@rahino/database/models/core/user.entity';
import {
  InventoryStatusEnum,
  VariationPriceIdEnum,
} from '@rahino/ecommerce/inventory/enum';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { Op } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ECInventoryStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-status.entity';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
import { ECColor } from '@rahino/database/models/ecommerce-eav/ec-color.entity';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { ECGuaranteeMonth } from '@rahino/database/models/ecommerce-eav/ec-guarantee-month.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { InventoryTrackChangeService } from '@rahino/ecommerce/inventory-track-change/inventory-track-change.service';
import { InventoryTrackChangeStatusEnum } from '@rahino/ecommerce/util/enum';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(ECInventory)
    private readonly repository: typeof ECInventory,
    @InjectModel(ECInventoryPrice)
    private readonly inventoryPriceRepository: typeof ECInventoryPrice,
    private readonly inventoryTrackChangeService: InventoryTrackChangeService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findById(id: bigint) {
    return await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'productId',
          'vendorId',
          'colorId',
          'guaranteeId',
          'guaranteeMonthId',
          'qty',
          'onlyProvinceId',
          'vendorAddressId',
          'weight',
          'inventoryStatusId',
        ])
        .include([
          {
            attributes: ['id', 'name'],
            model: ECInventoryStatus,
            as: 'inventoryStatus',
            required: false,
          },
          {
            attributes: ['id', 'name'],
            model: ECVendor,
            as: 'vendor',
            required: false,
          },
          {
            attributes: ['id', 'name', 'hexCode'],
            model: ECColor,
            as: 'color',
            required: false,
          },
          {
            attributes: ['id', 'name', 'slug'],
            model: ECGuarantee,
            as: 'guarantee',
            required: false,
          },
          {
            attributes: ['id', 'name'],
            model: ECGuaranteeMonth,
            as: 'guaranteeMonth',
            required: false,
          },
          {
            attributes: ['id', 'name'],
            model: ECProvince,
            as: 'onlyProvince',
            required: false,
          },
          {
            attributes: ['price'],
            model: ECInventoryPrice,
            as: 'firstPrice',
            required: false,
            include: [
              {
                attributes: ['id', 'name'],
                model: ECVariationPrice,
                as: 'variationPrice',
              },
            ],
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('firstPrice.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          },
          {
            attributes: ['price'],
            model: ECInventoryPrice,
            as: 'secondaryPrice',
            required: false,
            include: [
              {
                attributes: ['id', 'name'],
                model: ECVariationPrice,
                as: 'variationPrice',
              },
            ],
            where: Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('secondaryPrice.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          },
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECInventory.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          inventoryStatusId: InventoryStatusEnum.available,
        })
        .filter({ id: id })
        .build(),
    );
  }
  async bulkInsert(
    user: User,
    productId: bigint,
    inventories: InventoryDto[],
    transaction?: Transaction,
  ) {
    for (const inventory of inventories) {
      const mappedItem = this.mapper.map(inventory, InventoryDto, ECInventory);
      const insertItem = _.omit(mappedItem.toJSON(), ['id']);
      insertItem.userId = user.id;
      insertItem.inventoryStatusId =
        inventory.qty > 0
          ? InventoryStatusEnum.available
          : InventoryStatusEnum.unavailable;
      insertItem.productId = productId;
      const inventoryInsert = await this.repository.create(insertItem, {
        transaction: transaction,
      });

      await this.inventoryTrackChangeService.changeStatus(
        inventoryInsert.id,
        InventoryTrackChangeStatusEnum.Create,
        inventoryInsert.qty,
        null,
        transaction,
      );

      if (inventory.firstPrice) {
        await this.inventoryPriceRepository.create(
          {
            inventoryId: inventoryInsert.id,
            variationPriceId: VariationPriceIdEnum.firstPrice,
            buyPrice: inventory.buyPrice,
            price: inventory.firstPrice,
            userId: user.id,
          },
          {
            transaction: transaction,
          },
        );
      }

      if (inventory.secondaryPrice) {
        await this.inventoryPriceRepository.create(
          {
            inventoryId: inventoryInsert.id,
            variationPriceId: VariationPriceIdEnum.secondaryPrice,
            buyPrice: inventory.buyPrice,
            price: inventory.secondaryPrice,
            userId: user.id,
          },
          {
            transaction: transaction,
          },
        );
      }
    }
  }

  async removeInventories(
    user: User,
    inventoryIds: bigint[],
    transaction?: Transaction,
  ) {
    if (inventoryIds.length > 0) {
      await this.repository.update(
        {
          isDeleted: true,
          deletedBy: user.id,
        },
        {
          where: {
            id: {
              [Op.in]: inventoryIds,
            },
          },
          transaction: transaction,
        },
      );
    }
  }

  async bulkUpdate(
    user: User,
    inventories: InventoryDto[],
    transaction?: Transaction,
  ) {
    for (const inventory of inventories) {
      const mappedItem = this.mapper.map(inventory, InventoryDto, ECInventory);
      const updateItem = _.omit(mappedItem.toJSON(), ['id']);
      updateItem.id = inventory.id;
      updateItem.inventoryStatusId =
        inventory.qty > 0
          ? InventoryStatusEnum.available
          : InventoryStatusEnum.unavailable;

      await this.inventoryTrackChangeService.changeStatus(
        updateItem.id,
        InventoryTrackChangeStatusEnum.Update,
        inventory.qty,
        null,
        transaction,
      );

      // deleted all prices
      await this.inventoryPriceRepository.update(
        { isDeleted: true, deletedBy: user.id },
        {
          where: {
            inventoryId: inventory.id,
          },
          transaction: transaction,
        },
      );
      // update inventory
      await this.repository.update(updateItem, {
        where: {
          id: inventory.id,
        },
        transaction: transaction,
      });
      if (inventory.firstPrice) {
        await this.inventoryPriceRepository.create(
          {
            inventoryId: inventory.id,
            variationPriceId: VariationPriceIdEnum.firstPrice,
            price: inventory.firstPrice,
            buyPrice: inventory.buyPrice,
            userId: user.id,
          },
          {
            transaction: transaction,
          },
        );
      }

      if (inventory.secondaryPrice) {
        await this.inventoryPriceRepository.create(
          {
            inventoryId: inventory.id,
            variationPriceId: VariationPriceIdEnum.secondaryPrice,
            price: inventory.secondaryPrice,
            buyPrice: inventory.buyPrice,
            userId: user.id,
          },
          {
            transaction: transaction,
          },
        );
      }
    }
  }

  async findByVendorIds(vendorIds: number[], productId: bigint) {
    return await this.repository.findAll(
      new QueryOptionsBuilder()
        .filter({
          vendorId: {
            [Op.in]: vendorIds,
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECInventory.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          productId: productId,
        })
        .build(),
    );
  }
}
