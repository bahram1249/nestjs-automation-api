import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { QrScanController } from './qrscan.controller';
import { QrScanService } from './qrscan.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission])],
  controllers: [QrScanController],
  providers: [QrScanService],
})
export class QrScanModule {}
