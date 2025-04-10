import { BadRequestException, Injectable } from '@nestjs/common';
import { RialPriceDto } from './dto';
import { GSUnitPriceEnum } from '../unit-price';

@Injectable()
export class RialPriceService {
  constructor() {}

  getRialPrice(dto: RialPriceDto): number {
    switch (dto.unitPriceId) {
      case GSUnitPriceEnum.Rial:
        return dto.price;

      case GSUnitPriceEnum.Toman:
        return dto.price * 10;

      default:
        throw new BadRequestException('invalid unitprice');
    }
  }
}
