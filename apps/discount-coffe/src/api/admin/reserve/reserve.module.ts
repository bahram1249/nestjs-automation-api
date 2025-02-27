import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { BuffetReserve } from '@rahino/localdatabase/models';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { BuffetMenu } from '@rahino/localdatabase/models';
import { BuffetReserveDetail } from '@rahino/localdatabase/models';
import { Buffet } from '@rahino/localdatabase/models';

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
