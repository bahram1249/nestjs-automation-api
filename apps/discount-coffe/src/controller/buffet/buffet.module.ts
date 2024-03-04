import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BuffetController } from './buffet.controller';
import { BuffetService } from './buffet.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { BuffetMenuCategory } from '@rahino/database/models/discount-coffe/buffet-menu-category.entity';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';
import { WebAuthDiscountCoffeMiddleware } from '@rahino/commonmiddleware/middlewares/web-auth-discountcoffe.middleware';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { BuffetMenu } from '@rahino/database/models/discount-coffe/buffet-menu.entity';
import { BuffetReserveDetail } from '@rahino/database/models/discount-coffe/buffet-reserve-detail.entity';
import { BuffetType } from '@rahino/database/models/discount-coffe/buffet-type.entity';
import { BuffetCost } from '@rahino/database/models/discount-coffe/buffet-cost.entity';
import { BuffetCity } from '@rahino/database/models/discount-coffe/city.entity';
import { CoffeOption } from '@rahino/database/models/discount-coffe/coffe-option.entity';

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
