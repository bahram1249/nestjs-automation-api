import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ReserveController } from './reserve.controller';
import { ReserveService } from './reserve.service';

import { BuffetReserve } from '@rahino/localdatabase/models';
import { Buffet } from '@rahino/localdatabase/models';
import { BuffetMenuCategory } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      BuffetReserve,
      Buffet,
      BuffetMenuCategory,
    ]),
  ],
  controllers: [ReserveController],
  providers: [ReserveService],
})
export class ReserveModule {}
