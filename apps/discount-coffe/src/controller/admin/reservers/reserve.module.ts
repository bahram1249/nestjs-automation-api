import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ReserveController } from './reserve.controller';
import { ReserveService } from './reserve.service';

import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetReserve])],
  controllers: [ReserveController],
  providers: [ReserveService],
})
export class ReserveModule {}
