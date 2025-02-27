import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { TotalReserveController } from './total-reserve.controller';
import { TotalReserveService } from './total-reserve.service';

import { BuffetReserve } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetReserve])],
  controllers: [TotalReserveController],
  providers: [TotalReserveService],
})
export class TotalReserveModule {}
