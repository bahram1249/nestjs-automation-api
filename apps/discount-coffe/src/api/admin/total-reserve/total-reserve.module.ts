import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';
import { TotalReserveService } from './total-reserve.service';
import { TotalReserveController } from './total-reserve.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetReserve])],
  providers: [TotalReserveService],
  controllers: [TotalReserveController],
})
export class TotalReserveApiModule {}
