import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BuffetController } from './buffet.controller';
import { BuffetService } from './buffet.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/database';
import { BuffetMenuCategory } from '@rahino/database';
import { PersianDate } from '@rahino/database';
import { BuffetReserve } from '@rahino/database';
import { WebAuthDiscountCoffeMiddleware } from '@rahino/commonmiddleware/middlewares/web-auth-discountcoffe.middleware';
import { Attachment } from '@rahino/database';
import { BuffetMenu } from '@rahino/database';
import { BuffetReserveDetail } from '@rahino/database';
import { BuffetType } from '@rahino/database';
import { BuffetCost } from '@rahino/database';
import { BuffetCity } from '@rahino/database';
import { CoffeOption } from '@rahino/database';
import { BuffetIgnoreReserve } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Buffet,
      BuffetMenuCategory,
      PersianDate,
      BuffetReserve,
      BuffetMenu,
      BuffetReserveDetail,
      BuffetType,
      BuffetCost,
      BuffetCity,
      CoffeOption,
      BuffetIgnoreReserve,
      Attachment,
    ]),
  ],
  controllers: [BuffetController],
  providers: [BuffetService],
})
export class BuffetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WebAuthDiscountCoffeMiddleware)
      .forRoutes('/buffet/completeReserve');
  }
}
