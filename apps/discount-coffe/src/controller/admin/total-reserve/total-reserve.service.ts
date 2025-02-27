import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuffetReserve } from '@rahino/localdatabase/models';

@Injectable()
export class TotalReserveService {
  constructor(
    @InjectModel(BuffetReserve)
    private readonly repository: typeof BuffetReserve,
  ) {}

  async edit(buffetMenuId: bigint) {
    throw new NotImplementedException();

    // return {
    //   title: 'ویرایش ' + buffetMenu.title,
    //   layout: false,
    //   buffetMenuCategories: JSON.parse(JSON.stringify(buffetMenuCategories)),
    // };
  }
}
