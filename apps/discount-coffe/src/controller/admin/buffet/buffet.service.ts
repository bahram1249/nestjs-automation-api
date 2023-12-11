import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { User } from '@rahino/database/models/core/user.entity';

import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { BuffetType } from '@rahino/database/models/discount-coffe/buffet-type.entity';
import { BuffetCost } from '@rahino/database/models/discount-coffe/buffet-cost.entity';

@Injectable()
export class BuffetService {
  constructor(
    @InjectModel(Buffet)
    private readonly repository: typeof Buffet,
    @InjectModel(BuffetType)
    private readonly buffetTypeRepository: typeof BuffetType,
    @InjectModel(BuffetCost)
    private readonly buffetCostRepository: typeof BuffetCost,
  ) {}

  async edit(userId: number) {
    throw new NotImplementedException();

    // return {
    //   title: 'ویرایش ' + user.firstname,
    //   layout: false,
    // };
  }

  async create() {
    const buffetTypes = await this.buffetTypeRepository.findAll();
    const buffetCosts = await this.buffetCostRepository.findAll();
    return {
      title: 'ایجاد کافه رستوران',
      layout: false,
      buffetTypes: JSON.parse(JSON.stringify(buffetTypes)),
      buffetCosts: JSON.parse(JSON.stringify(buffetCosts)),
      //roles: JSON.parse(JSON.stringify(roles)),
    };
  }
}
