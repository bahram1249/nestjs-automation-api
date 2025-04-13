import { Module } from '@nestjs/common';
import { ClientVendorController } from './client-vendor.controller';
import { ClientVendorService } from './client-vendor.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVendor } from '@rahino/localdatabase/models';
import { SessionModule } from '../../user/session/session.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SessionModule,
    SequelizeModule.forFeature([ECVendor]),
    LocalizationModule,
  ],
  controllers: [ClientVendorController],
  providers: [ClientVendorService],
})
export class ClientVendorModule {}
