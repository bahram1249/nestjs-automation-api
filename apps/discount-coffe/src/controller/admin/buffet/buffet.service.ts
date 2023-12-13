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
  ) {}

  async create() {
    const buffetTypes = await this.buffetTypeRepository.findAll();
    const buffetCosts = await this.buffetCostRepository.findAll();
    const buffetCities = await this.buffetCityRepository.findAll();
    return {
      title: 'ایجاد کافه رستوران',
      layout: false,
      buffetTypes: JSON.parse(JSON.stringify(buffetTypes)),
      buffetCosts: JSON.parse(JSON.stringify(buffetCosts)),
      buffetCities: JSON.parse(JSON.stringify(buffetCities)),
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
    return {
      title: 'ویرایش ' + buffet.title,
      layout: false,
      buffetTypes: JSON.parse(JSON.stringify(buffetTypes)),
      buffetCosts: JSON.parse(JSON.stringify(buffetCosts)),
      buffetCities: JSON.parse(JSON.stringify(buffetCities)),
      buffet: buffet.toJSON(),
      owner: owner.toJSON(),
      //roles: JSON.parse(JSON.stringify(roles)),
    };
  }
}
