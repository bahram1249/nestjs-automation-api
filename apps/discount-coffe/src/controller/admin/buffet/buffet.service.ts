import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Buffet } from '@rahino/localdatabase/models';
import { BuffetType } from '@rahino/localdatabase/models';
import { BuffetCost } from '@rahino/localdatabase/models';
import { BuffetCity } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { CoffeOption } from '@rahino/localdatabase/models';
import { BuffetOption } from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';

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
      include: [
        {
          model: Attachment,
          as: 'buffetGalleries',
          required: false,
        },
      ],
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
    const buffet = await this.repository.findOne({
      where: {
        id: buffetId,
      },
    });
    if (!buffet) throw new NotFoundException();
    return {
      title: 'لیست منو های کافه',
      layout: 'empty',
      buffet: buffet.toJSON(),
    };
  }
}
