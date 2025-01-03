import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { BuffetReserve } from '@rahino/database';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { BuffetMenu } from '@rahino/database';
import { BuffetReserveDetail } from '@rahino/database';
import { Buffet } from '@rahino/database';

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
