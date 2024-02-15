import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryDto, RequiredProductFieldDto } from './dto';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ECColor } from '@rahino/database/models/ecommerce-eav/ec-color.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { UserVendorService } from '@rahino/ecommerce/user/vendor/user-vendor.service';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { ECGuaranteeMonth } from '@rahino/database/models/ecommerce-eav/ec-guarantee-month.entity';
import { VendorAddressService } from '@rahino/ecommerce/vendor-address/vendor-address.service';

@Injectable()
export class InventoryValidationService {
  constructor(
    @InjectModel(ECVariationPrice)
    private readonly variationPriceRepository: typeof ECVariationPrice,
    @InjectModel(ECColor)
    private readonly colorRepository: typeof ECColor,
    @InjectModel(ECGuarantee)
    private readonly guaranteeRepository: typeof ECGuarantee,
    @InjectModel(ECGuaranteeMonth)
    private readonly guaranteeMonthRepository: typeof ECGuaranteeMonth,
    private readonly userVendorService: UserVendorService,
    private readonly vendorAddressService: VendorAddressService,
  ) {}

  async validation(
    user: User,
    requiredDto: RequiredProductFieldDto,
    dto: InventoryDto[],
  ) {
    await this.requiredPriceValidation(dto);
    await this.colorBasedValidation(requiredDto, dto);
    await this.vendorValidation(user, dto);
    await this.guaranteeValidation(dto);
    await this.vendorAddressValidation(user, dto);
  }

  // this function is a sample only
  // but required to change
  // for using in first project
  async requiredPriceValidation(dto: InventoryDto[]) {
    const requiredPrices = await this.variationPriceRepository.findAll(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', 'ECVariationPrices.required', 0),
            {
              [Op.eq]: 1,
            },
          ),
        )
        .build(),
    );
    const firstPriceId = 1;
    const secondaryPriceId = 2;
    let firstPriceRequired = false;
    let secondaryPriceRequired = false;
    for (const requiredPrice of requiredPrices) {
      if (requiredPrice.id == firstPriceId) {
        firstPriceRequired = true;
      } else if (requiredPrice.id == secondaryPriceId) {
        secondaryPriceRequired = true;
      }
    }
    for (const inventory of dto) {
      if (inventory.firstPrice == null && firstPriceRequired == true) {
        throw new BadRequestException('the first price is required !');
      }
      if (inventory.secondaryPrice == null && secondaryPriceRequired == true) {
        throw new BadRequestException('secondary price is required !');
      }
    }
  }

  // check if the product is color based, colorId in inventory record must be send it.
  async colorBasedValidation(
    requiredDto: RequiredProductFieldDto,
    dto: InventoryDto[],
  ) {
    for (const inventoryDto of dto) {
      if (requiredDto.colorBased == true && inventoryDto.colorId == null) {
        throw new BadRequestException("color can't be null");
      }
      if (inventoryDto.colorId) {
        const color = await this.colorRepository.findOne(
          new QueryOptionsBuilder()
            .filter(
              Sequelize.where(Sequelize.fn('isnull', 'ECColor.isDeleted', 0), {
                [Op.eq]: 0,
              }),
            )
            .build(),
        );
        if (!color) {
          throw new BadRequestException('the color you pick is not available!');
        }
      }
    }
  }

  // check access to selected vendor
  async vendorValidation(user: User, dto: InventoryDto[]) {
    const vendors = (await this.userVendorService.findAll(user, {})).result;
    for (const inventoryDto of dto) {
      const findVendor = vendors.find(
        (vendor) => vendor.id == inventoryDto.vendorId,
      );
      if (!findVendor) {
        throw new BadRequestException(
          'the given vendor for inventories is not valid !',
        );
      }
    }
  }

  // guarantee validation business role
  private async guaranteeValidation(dto: InventoryDto[]) {
    for (const inventoryDto of dto) {
      if (inventoryDto.guaranteeId == null && inventoryDto.guaranteeMonthId) {
        throw new BadRequestException('guarantee month is not valid !');
      }
      if (inventoryDto.guaranteeId) {
        const guarantee = await this.guaranteeRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ id: inventoryDto.guaranteeId })
            .filter(
              Sequelize.where(
                Sequelize.fn('isnull', 'ECGuarantee.isDeleted', 0),
                {
                  [Op.eq]: 0,
                },
              ),
            )
            .build(),
        );
        if (!guarantee) {
          throw new BadRequestException('guarantee is not valid !');
        }
      }
      if (inventoryDto.guaranteeMonthId) {
        const guaranteeMonth = await this.guaranteeMonthRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ id: inventoryDto.guaranteeMonthId })
            .build(),
        );
        if (!guaranteeMonth) {
          throw new BadRequestException('guarantee month is not valid !');
        }
      }
    }
  }

  // check address exists and for selected vendor
  private async vendorAddressValidation(user: User, dto: InventoryDto[]) {
    for (const inventoryDto of dto) {
      const vendorAddress = (
        await this.vendorAddressService.findById(
          user,
          inventoryDto.vendorAddressId,
        )
      ).result;
      if (vendorAddress.vendorId != inventoryDto.vendorId) {
        throw new BadRequestException('address incorrect !');
      }
    }
  }
}
