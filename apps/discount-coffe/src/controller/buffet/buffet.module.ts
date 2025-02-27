import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BuffetController } from './buffet.controller';
import { BuffetService } from './buffet.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/localdatabase/models';
import { BuffetMenuCategory } from '@rahino/localdatabase/models';
import { PersianDate } from '@rahino/database';
import { BuffetReserve } from '@rahino/localdatabase/models';
import { WebAuthDiscountCoffeMiddleware } from '@rahino/commonmiddleware';
import { Attachment } from '@rahino/database';
import { BuffetMenu } from '@rahino/localdatabase/models';
import { BuffetReserveDetail } from '@rahino/localdatabase/models';
import { BuffetType } from '@rahino/localdatabase/models';
import { BuffetCost } from '@rahino/localdatabase/models';
import { BuffetCity } from '@rahino/localdatabase/models';
import { CoffeOption } from '@rahino/localdatabase/models';
import { BuffetIgnoreReserve } from '@rahino/localdatabase/models';

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
