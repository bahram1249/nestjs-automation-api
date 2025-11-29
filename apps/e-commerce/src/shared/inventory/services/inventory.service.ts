import { Inject, Injectable } from '@nestjs/common';
import { InventoryDto } from '../dto';
import { Sequelize, Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import {
  EAVEntityType,
  ECInventory,
  ECProduct,
} from '@rahino/localdatabase/models';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';
import { ECInventoryPrice } from '@rahino/localdatabase/models';
import { Op } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ECInventoryStatus } from '@rahino/localdatabase/models';
import { ECVendor } from '@rahino/localdatabase/models';
import { ECColor } from '@rahino/localdatabase/models';
import { ECGuarantee } from '@rahino/localdatabase/models';
import { ECGuaranteeMonth } from '@rahino/localdatabase/models';
import { ECProvince } from '@rahino/localdatabase/models';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import { InventoryTrackChangeService } from '@rahino/ecommerce/shared/inventory-track-change/inventory-track-change.service';
import { InventoryTrackChangeStatusEnum } from '@rahino/ecommerce/shared/enum';
import { CAL_PRICE_PROVIDER_TOKEN } from '@rahino/ecommerce/admin/product-section/product/price-cal-factory/constants';
import { ICalPrice } from '@rahino/ecommerce/admin/product-section/product/price-cal-factory/interface/cal-price.interface';
import { ProductDto } from '@rahino/ecommerce/admin/product-section/product/dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(ECInventory)
    private readonly repository: typeof ECInventory,
    @InjectModel(ECInventoryPrice)
    private readonly inventoryPriceRepository: typeof ECInventoryPrice,
    private readonly inventoryTrackChangeService: InventoryTrackChangeService,
    @Inject(CAL_PRICE_PROVIDER_TOKEN)
    private readonly calPriceService: ICalPrice,
    @InjectMapper()
    private readonly mapper: Mapper,
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
            attributes: ['id', 'name', 'slug', 'latitude', 'longitude'],
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
        .thenInclude({
          model: ECProduct,
          as: 'product',
          required: true,
          include: [
            {
              model: EAVEntityType,
              as: 'entityType',
              required: true,
            },
          ],
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
          inventoryStatusId: InventoryStatusEnum.available,
        })
        .filter({ id: id })
        .build(),
    );
  }
  async bulkInsert(
    user: User,
    productId: bigint,
    productDto: ProductDto,
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

      for (let index = 0; index < inventory.inventoryPrices.length; index++) {
        const newPrice = await this.calPriceService.getPrice(
          productDto,
          inventory.inventoryPrices[index],
          inventory.buyPrice,
          inventory.weight,
        );
        inventory.inventoryPrices[index] = _.omit(newPrice, ['buyPrice']);
        inventory.buyPrice = newPrice.buyPrice;
      }

      for (let index = 0; index < inventory.inventoryPrices.length; index++) {
        await this.inventoryPriceRepository.create(
          {
            inventoryId: inventoryInsert.id,
            variationPriceId: inventory.inventoryPrices[index].variationPriceId,
            buyPrice: inventory.buyPrice,
            price: inventory.inventoryPrices[index].price,
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
    productDto: ProductDto,
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
      for (let index = 0; index < inventory.inventoryPrices.length; index++) {
        const newPrice = await this.calPriceService.getPrice(
          productDto,
          inventory.inventoryPrices[index],
          inventory.buyPrice,
          inventory.weight,
        );
        inventory.inventoryPrices[index] = _.omit(newPrice, ['buyPrice']);
        inventory.buyPrice = newPrice.buyPrice;
      }

      for (let index = 0; index < inventory.inventoryPrices.length; index++) {
        await this.inventoryPriceRepository.create(
          {
            inventoryId: inventory.id,
            variationPriceId: inventory.inventoryPrices[index].variationPriceId,
            buyPrice: inventory.buyPrice,
            price: inventory.inventoryPrices[index].price,
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
