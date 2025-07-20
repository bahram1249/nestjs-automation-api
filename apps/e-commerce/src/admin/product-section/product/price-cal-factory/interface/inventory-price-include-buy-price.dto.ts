import { IntersectionType } from '@nestjs/swagger';
import { InventoryPriceDto } from '@rahino/ecommerce/shared/inventory/dto/inventory-price.dto';
import { BuyPriceDto } from './buy-price.dto';

export class InventoryPriceIncludeBuyPriceDto extends IntersectionType(
  InventoryPriceDto,
  BuyPriceDto,
) {}
