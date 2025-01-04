import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { ExtendOptionMiddleware } from '@rahino/commonmiddleware';
import { RoleController } from './role/role.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [RoleModule, UserModule],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtendOptionMiddleware)
      .forRoutes(RoleController, UserController);
  }
}
