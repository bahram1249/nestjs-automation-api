import { Module } from '@nestjs/common';
import { QrScanController } from './qrscan.controller';
import { QrScanService } from './qrscan.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, BuffetReserve, Buffet]),
  ],
  controllers: [QrScanController],
  providers: [QrScanService],
})
export class QrScanApiModule {}
