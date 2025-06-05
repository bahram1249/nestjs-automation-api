import { Module } from '@nestjs/common';
import { NearbyVendorController } from './nearby-vendor.controller';
import { NearbyVendorService } from './nearby-vendor.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVendor } from '@rahino/localdatabase/models';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';

@Module({
  imports: [
    SessionModule,
    SequelizeModule.forFeature([ECVendor]),
    SequelizeModule,
  ],
  controllers: [NearbyVendorController],
  providers: [NearbyVendorService],
})
export class AnonymousNearbyVendorModule {}
