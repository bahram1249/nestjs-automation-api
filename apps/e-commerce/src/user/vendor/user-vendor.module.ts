import { Module } from '@nestjs/common';
import { UserVendorController } from './user-vendor.controller';
import { UserVendorService } from './user-vendor.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVendorUser } from '@rahino/localdatabase/models';
import { ECVendor } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECVendorUser, ECVendor])],
  controllers: [UserVendorController],
  providers: [UserVendorService],
  exports: [UserVendorService],
})
export class UserVendorModule {}
