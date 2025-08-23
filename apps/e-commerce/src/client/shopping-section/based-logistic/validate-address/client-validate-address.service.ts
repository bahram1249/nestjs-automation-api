import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidateAddressDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/localdatabase/models';
import { CityEnum } from '@rahino/ecommerce/shared/enum/city.enum';
import { ProvinceEnum } from '@rahino/ecommerce/shared/enum';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class ClientValidateAddressService {
  constructor(
    @InjectModel(ECProvince)
    private readonly provinceRepository: typeof ECProvince,
  ) {}

  async validateAddress(dto: ValidateAddressDto) {
    for (let index = 0; index < dto.stocks.length; index++) {
      const stock = dto.stocks[index];
      if (
        stock.inventory.onlyProvinceId != null &&
        (stock.inventory.onlyProvinceId != dto.address.provinceId ||
          (stock.inventory.onlyProvinceId == ProvinceEnum.Tehran &&
            dto.address.cityId != CityEnum.Tehran))
      ) {
        const province = await this.provinceRepository.findOne(
          new QueryOptionsBuilder()
            .filter({
              id: stock.inventory.onlyProvinceId,
            })
            .build(),
        );
        throw new BadRequestException(
          `${stock.product.title} فقط مجوز ارسال به استان ${province.name} را دارد.`,
        );
      }
    }
  }
}
