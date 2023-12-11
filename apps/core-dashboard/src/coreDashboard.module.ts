import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { LoginModule } from './login/login.module';

import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { UserModule } from './user/user.module';
import { ExtendOptionMiddleware } from '@rahino/commonmiddleware/middlewares/extend-option.middleware';
import { RoleController } from './role/role.controller';
import { UserController } from './user/user.controller';
@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    LoginModule,
    RoleModule,
    UserModule,
  ],
})
export class CoreDashboardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtendOptionMiddleware)
      .forRoutes(RoleController, UserController);
  }
}
