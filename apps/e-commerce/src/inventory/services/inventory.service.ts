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

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(ECInventory)
    private readonly repository: typeof ECInventory,
    @InjectModel(ECInventoryPrice)
    private readonly inventoryPriceRepository: typeof ECInventoryPrice,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

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
