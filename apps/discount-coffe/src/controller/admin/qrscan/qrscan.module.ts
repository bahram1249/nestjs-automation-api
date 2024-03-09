import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { QrScanController } from './qrscan.controller';
import { QrScanService } from './qrscan.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission])],
  controllers: [QrScanController],
  providers: [QrScanService],
})
export class QrScanModule {}
