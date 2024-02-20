import { Injectable } from '@nestjs/common';
import { InventoryDto } from '../dto';
import { Transaction } from 'sequelize';
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
}
