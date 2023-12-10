import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { User } from '@rahino/database/models/core/user.entity';

import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';

@Injectable()
export class BuffetService {
  constructor(
    @InjectModel(Buffet)
    private readonly repository: typeof Buffet,
  ) {}

  async edit(userId: number) {
    throw new NotImplementedException();

    // return {
    //   title: 'ویرایش ' + user.firstname,
    //   layout: false,
    // };
  }

  async create() {
    throw new NotImplementedException();
    // // const roles = await this.roleRepository.findAll();
    // return {
    //   title: 'ایجاد کاربر',
    //   layout: false,
    //   roles: JSON.parse(JSON.stringify(roles)),
    // };
  }
}
