import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECStock } from '@rahino/database/models/ecommerce-eav/ec-stocks.entity';
import { StockDto } from '../dto';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { InventoryService } from '@rahino/ecommerce/inventory/services';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { Sequelize } from 'sequelize';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StockAvailabilityInventoryService {
  constructor(
    @InjectModel(ECStock)
    private readonly repository: typeof ECStock,
    private readonly inventoryService: InventoryService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly config: ConfigService,
  ) {}

  async insert(session: ECUserSession, dto: StockDto) {
    const inventory = await this.inventoryService.findById(dto.inventoryId);
    if (!inventory) {
      throw new BadRequestException("the inventory isn't available");
    }
    if (dto.qty > inventory.qty) {
      throw new BadRequestException("the inventory isn't available");
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
    const item = await this.repository.create(insertedItem);
    return _.pick(item, ['id', 'inventoryId', 'qty', 'expire', 'productId']);
  }
}
