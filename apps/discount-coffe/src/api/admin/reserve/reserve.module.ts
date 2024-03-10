import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { BuffetMenu } from '@rahino/database/models/discount-coffe/buffet-menu.entity';
import { BuffetReserveDetail } from '@rahino/database/models/discount-coffe/buffet-reserve-detail.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      BuffetReserve,
      BuffetMenu,
      BuffetReserveDetail,
      Buffet,
    ]),
  ],
  providers: [ReserveService],
  controllers: [ReserveController],
})
export class ReserveApiModule {}
