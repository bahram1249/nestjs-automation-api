import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECStock } from '@rahino/localdatabase/models';
import { StockDto } from '../dto';
import { ECUserSession } from '@rahino/localdatabase/models';
import { InventoryService } from '@rahino/ecommerce/shared/inventory/services';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { Op, Sequelize } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class StockAvailabilityInventoryService {
  constructor(
    @InjectModel(ECStock)
    private readonly repository: typeof ECStock,
    private readonly inventoryService: InventoryService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly config: ConfigService,
    private readonly localizationService: LocalizationService,
  ) {}

  async insert(session: ECUserSession, dto: StockDto) {
    const inventory = await this.inventoryService.findById(dto.inventoryId);
    if (!inventory) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_inventory_isnt_available',
        ),
      );
    }

    let findItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ productId: inventory.productId })
        .filter({ sessionId: session.id })
        .filter({ inventoryId: inventory.id })
        .filter({
          expire: {
            [Op.gt]: Sequelize.fn('getdate'),
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isPurchase'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (findItem) {
      dto.qty = dto.qty + findItem.qty;
    }
    if (dto.qty > inventory.qty) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_inventory_isnt_available',
        ),
      );
    }
    if (dto.qty <= 0) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_inventory_isnt_available',
        ),
      );
    }
    const increase = this.config.get<number>('STOCK_EXPIRE_DAY') || 2;
    const mappedItem = this.mapper.map(dto, StockDto, ECStock);
    const insertedItem = _.omit(mappedItem.toJSON(), ['id']);
    insertedItem.productId = inventory.productId;
    insertedItem.sessionId = session.id;
    insertedItem.expire = Sequelize.fn(
      'dateadd',
      Sequelize.literal('day'),
      increase,
      Sequelize.fn('getdate'),
    );
    if (findItem) {
      findItem = (
        await this.repository.update(insertedItem, {
          where: {
            id: findItem.id,
          },
          returning: true,
        })
      )[1][0];
    } else {
      findItem = await this.repository.create(insertedItem);
    }

    return _.pick(findItem, [
      'id',
      'inventoryId',
      'qty',
      'expire',
      'productId',
    ]);
  }

  async update(session: ECUserSession, dto: StockDto) {
    const inventory = await this.inventoryService.findById(dto.inventoryId);
    if (!inventory) {
      throw new BadRequestException("the inventory isn't available");
    }

    let findItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ productId: inventory.productId })
        .filter({ sessionId: session.id })
        .filter({ inventoryId: inventory.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isPurchase'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          expire: {
            [Op.gt]: Sequelize.fn('getdate'),
          },
        })
        .build(),
    );
    if (!findItem) {
      throw new NotFoundException("the stock you mentioned isn't exists");
    }

    if (dto.qty > inventory.qty) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_inventory_isnt_available',
        ),
      );
    }
    if (dto.qty == 0) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.at_least_inventory_qty_must_be_greater_than_zero',
        ),
      );
    }
    const increase = this.config.get<number>('STOCK_EXPIRE_DAY') || 2;
    const mappedItem = this.mapper.map(dto, StockDto, ECStock);
    const insertedItem = _.omit(mappedItem.toJSON(), ['id']);
    insertedItem.productId = inventory.productId;
    insertedItem.sessionId = session.id;
    insertedItem.expire = Sequelize.fn(
      'dateadd',
      Sequelize.literal('day'),
      increase,
      Sequelize.fn('getdate'),
    );

    findItem = (
      await this.repository.update(insertedItem, {
        where: {
          id: findItem.id,
        },
        returning: true,
      })
    )[1][0];

    return _.pick(findItem, [
      'id',
      'inventoryId',
      'qty',
      'expire',
      'productId',
    ]);
  }

  async remove(stockId: bigint) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: stockId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isPurchase'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    item.isDeleted = true;
    await item.save();
    return item;
  }
}
