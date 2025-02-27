import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { BuffetReserve } from '@rahino/localdatabase/models';
import { TotalReserveService } from './total-reserve.service';
import { TotalReserveController } from './total-reserve.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetReserve])],
  providers: [TotalReserveService],
  controllers: [TotalReserveController],
})
export class TotalReserveApiModule {}
