import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AuthModule } from '../../api/core/auth/auth.module';
import { UserModule } from '../../api/core/admin/user/user.module';
import { RoleModule } from '../../api/core/admin/role/role.module';
import { RoleModule as UserRoleModule } from '../../api/core/user/role/role.module';
import { PermissionModule } from '../../api/core/admin/permission/permission.module';
import { MenuModule } from '../../api/core/admin/menu/menu.module';
import { PermissionGroupModule } from '../../api/core/admin/permission-group/permission-group.module';
import { ProfileModule } from '../../api/core/user/profile/profile.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    MenuModule,
    PermissionGroupModule,
    UserRoleModule,
    ProfileModule,
  ],
})
export class CoreRouteModule implements NestModule {
  constructor() {}
  private app: INestApplication;
  configure(consumer: MiddlewareConsumer) {}
  setApp(app: INestApplication<any>) {
    this.app = app;
    const coreConfig = new DocumentBuilder()
      .setTitle('Core Api')
      .setDescription('The Core API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const coreDocument = SwaggerModule.createDocument(this.app, coreConfig, {
      include: [CoreRouteModule],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api/core', this.app, coreDocument);
  }
}
