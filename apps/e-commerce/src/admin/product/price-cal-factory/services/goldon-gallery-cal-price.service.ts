import { Injectable } from '@nestjs/common';
import { ICalPrice } from '../interface/cal-price.interface';
import { ProductDto } from '../../dto';
import { InventoryPriceDto } from '@rahino/ecommerce/inventory/dto/inventory-price.dto';

@Injectable()
export class GoldonGalleryCalPriceService implements ICalPrice {
  constructor() {}
  async getPrice(
    dto: Pick<ProductDto, 'weight'>,
    inventoryPriceDto: InventoryPriceDto,
  ): Promise<InventoryPriceDto> {
    inventoryPriceDto.price = await this.getPriceByWeightFirstFormula(
      dto.weight,
    );
    return inventoryPriceDto;
  }

  async getPriceByWeightFirstFormula(weight: number): Promise<bigint> {
    return BigInt(weight * 10);
  }

  async getPriceByWeightSecondFormula(weight: number): Promise<bigint> {
    return BigInt(weight * 10);
  }
}
