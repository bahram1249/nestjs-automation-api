import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './admin/user/user.module';
import { RoleModule } from './admin/role/role.module';
import { RoleModule as UserRoleModule } from './user/role/role.module';
import { PermissionModule as UserPermissionModule } from './user/permission/permission.module';
import { PermissionModule } from './admin/permission/permission.module';
import { MenuModule } from './admin/menu/menu.module';
import { PermissionGroupModule } from './admin/permission-group/permission-group.module';
import { ProfileModule } from './user/profile/profile.module';
import { MenuModule as UserMenuModule } from './user/menu/menu.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RoleUtilModule } from './user/role-util/role-util.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    MenuModule,
    PermissionGroupModule,
    UserRoleModule,
    RoleUtilModule,
    ProfileModule,
    UserMenuModule,
    UserPermissionModule,
  ],
})
export class CoreModule implements NestModule {
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
      include: [CoreModule],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api/core', this.app, coreDocument);
  }
}
