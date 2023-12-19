import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { BuffetType } from '@rahino/database/models/discount-coffe/buffet-type.entity';
import { BuffetCost } from '@rahino/database/models/discount-coffe/buffet-cost.entity';
import { BuffetCity } from '@rahino/database/models/discount-coffe/city.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { CoffeOption } from '@rahino/database/models/discount-coffe/coffe-option.entity';
import { BuffetOption } from '@rahino/database/models/discount-coffe/buffet-option.entity';

@Injectable()
export class BuffetService {
  constructor(
    @InjectModel(Buffet)
    private readonly repository: typeof Buffet,
    @InjectModel(BuffetType)
    private readonly buffetTypeRepository: typeof BuffetType,
    @InjectModel(BuffetCost)
    private readonly buffetCostRepository: typeof BuffetCost,
    @InjectModel(BuffetCity)
    private readonly buffetCityRepository: typeof BuffetCity,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(CoffeOption)
    private readonly coffeOptionRepository: typeof CoffeOption,
    @InjectModel(BuffetOption)
    private readonly buffetOptionRepository: typeof BuffetOption,
  ) {}

  async create() {
    const buffetTypes = await this.buffetTypeRepository.findAll();
    const buffetCosts = await this.buffetCostRepository.findAll();
    const buffetCities = await this.buffetCityRepository.findAll();
    const coffeOptions = await this.coffeOptionRepository.findAll();
    return {
      title: 'ایجاد کافه رستوران',
      layout: false,
      buffetTypes: JSON.parse(JSON.stringify(buffetTypes)),
      buffetCosts: JSON.parse(JSON.stringify(buffetCosts)),
      buffetCities: JSON.parse(JSON.stringify(buffetCities)),
      coffeOptions: JSON.parse(JSON.stringify(coffeOptions)),
      //roles: JSON.parse(JSON.stringify(roles)),
    };
  }

  async edit(buffetId: bigint) {
    const buffet = await this.repository.findOne({
      where: {
        id: buffetId,
      },
    });
    if (!buffet) throw new NotFoundException();
    const owner = await this.userRepository.findOne({
      where: {
        id: buffet.ownerId,
      },
    });
    const buffetTypes = await this.buffetTypeRepository.findAll();
    const buffetCosts = await this.buffetCostRepository.findAll();
    const buffetCities = await this.buffetCityRepository.findAll();
    const coffeOptions = await this.coffeOptionRepository.findAll();
    const buffetOptions = await this.buffetOptionRepository.findAll({
      where: {
        buffetId: buffetId,
      },
    });
    const optionIds = buffetOptions.map(
      (buffetOption) => buffetOption.optionId,
    );
    return {
      title: 'ویرایش ' + buffet.title,
      layout: false,
      buffetTypes: JSON.parse(JSON.stringify(buffetTypes)),
      buffetCosts: JSON.parse(JSON.stringify(buffetCosts)),
      buffetCities: JSON.parse(JSON.stringify(buffetCities)),
      coffeOptions: JSON.parse(JSON.stringify(coffeOptions)),
      buffet: buffet.toJSON(),
      owner: owner.toJSON(),
      optionIds: optionIds,
      //roles: JSON.parse(JSON.stringify(roles)),
    };
  }

  async menus(buffetId: bigint) {
    return {
      title: 'لیست منو های کافه',
      layout: false,
    };
  }
}
