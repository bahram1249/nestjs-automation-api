import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { TotalReserveController } from './total-reserve.controller';
import { TotalReserveService } from './total-reserve.service';

import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetReserve])],
  controllers: [TotalReserveController],
  providers: [TotalReserveService],
})
export class TotalReserveModule {}
