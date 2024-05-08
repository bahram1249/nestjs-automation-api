import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { ECCourier } from '@rahino/database/models/ecommerce-eav/ec-courier.entity';
import { CourierService } from './courier.service';
import { CourierProfile } from './mapper';
import { UserRoleModule } from '@rahino/core/admin/user-role/user-role.module';
import { Role } from '@rahino/database/models/core/role.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, Role, ECCourier]),
    UserRoleModule,
  ],
  controllers: [],
  providers: [CourierService, CourierProfile],
})
export class CourierModule {}
