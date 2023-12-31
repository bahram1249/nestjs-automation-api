import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetReserve])],
  providers: [ReserveService],
  controllers: [ReserveController],
})
export class ReserveApiModule {}
