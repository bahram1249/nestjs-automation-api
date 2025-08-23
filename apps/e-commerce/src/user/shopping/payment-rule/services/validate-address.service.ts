import { BadRequestException, Injectable } from '@nestjs/common';
import { AddressService } from '@rahino/ecommerce/user/address/address.service';
import { validateAddressDto } from '../dto';
import { ProvinceEnum } from '@rahino/ecommerce/shared/enum';
import { CityEnum } from '@rahino/ecommerce/shared/enum/city.enum';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { InjectModel } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/localdatabase/models';

@Injectable()
export class ValidateAddressService {
  constructor(
    private readonly addressService: AddressService,
    @InjectModel(ECProvince) private readonly provinceRepository,
  ) {}

  public async validateAddress(dto: validateAddressDto) {
    const findAddress = (
      await this.addressService.findById(dto.user, dto.addressId)
    ).result;

    for (let index = 0; index < dto.stocks.length; index++) {
      const stock = dto.stocks[index];
      if (
        stock.inventory.onlyProvinceId != null &&
        (stock.inventory.onlyProvinceId != findAddress.provinceId ||
          (stock.inventory.onlyProvinceId == ProvinceEnum.Tehran &&
            findAddress.cityId != CityEnum.Tehran))
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
