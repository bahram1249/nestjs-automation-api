import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECCourier } from '@rahino/localdatabase/models';
import { CourierService } from './courier.service';
import { CourierProfile } from './mapper';
import { UserRoleModule } from '@rahino/core/admin/user-role/user-role.module';
import { Role } from '@rahino/database';
import { CourierController } from './courier.controller';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, Role, ECCourier]),
    UserRoleModule,
    UserVendorModule,
    LocalizationModule,
  ],
  controllers: [CourierController],
  providers: [CourierService, CourierProfile],
})
export class CourierModule {}
