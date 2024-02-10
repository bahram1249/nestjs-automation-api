import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WebAuthDiscountCoffeMiddleware } from '@rahino/commonmiddleware/middlewares/web-auth-discountcoffe.middleware';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';

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
