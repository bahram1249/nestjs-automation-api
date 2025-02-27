import { Module } from '@nestjs/common';
import { QrScanController } from './qrscan.controller';
import { QrScanService } from './qrscan.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { BuffetReserve } from '@rahino/localdatabase/models';
import { Buffet } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, BuffetReserve, Buffet]),
  ],
  controllers: [QrScanController],
  providers: [QrScanService],
})
export class QrScanApiModule {}
