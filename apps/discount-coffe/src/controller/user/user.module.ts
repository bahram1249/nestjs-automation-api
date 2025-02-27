import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WebAuthDiscountCoffeMiddleware } from '@rahino/commonmiddleware';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { BuffetReserve } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, BuffetReserve])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(WebAuthDiscountCoffeMiddleware).forRoutes(UserController);
  }
}
