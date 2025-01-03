import { Module } from '@nestjs/common';
import { QrScanController } from './qrscan.controller';
import { QrScanService } from './qrscan.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { BuffetReserve } from '@rahino/database';
import { Buffet } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, BuffetReserve, Buffet]),
  ],
  controllers: [QrScanController],
  providers: [QrScanService],
})
export class QrScanApiModule {}
