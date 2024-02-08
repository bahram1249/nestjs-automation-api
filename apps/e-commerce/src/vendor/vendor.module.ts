import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { VendorProfile } from './mapper';
import { UserRoleModule } from '@rahino/core/admin/user-role/user-role.module';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
import { ECVendorUser } from '@rahino/database/models/ecommerce-eav/ec-vendor-user.entity';
import { Role } from '@rahino/database/models/core/role.entity';
import { MinioClientModule } from '@rahino/minio-client';
import { ReverseProxyVendorImageMiddleware } from './reverse-proxy.middleware';

@Module({
  imports: [
    UserRoleModule,
    MinioClientModule,
    SequelizeModule.forFeature([
      User,
      Permission,
      Role,
      ECVendor,
      ECVendorUser,
    ]),
  ],
  controllers: [VendorController],
  providers: [VendorService, VendorProfile],
})
export class VendorModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyVendorImageMiddleware).forRoutes({
      path: '/v1/api/ecommerce/vendors/image',
      method: RequestMethod.GET,
    });
  }
}
