import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { BuffetController } from './buffet.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { Buffet } from '@rahino/database';
import { BuffetType } from '@rahino/database';
import { BuffetCost } from '@rahino/database';
import { BuffetCity } from '@rahino/database';
import { CoffeOption } from '@rahino/database';
import { BuffetOption } from '@rahino/database';
import { ExtendOptionMiddleware } from '@rahino/commonmiddleware/middlewares/extend-option.middleware';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      Buffet,
      BuffetType,
      BuffetCost,
      BuffetCity,
      CoffeOption,
      BuffetOption,
    ]),
  ],
  controllers: [BuffetController],
  providers: [BuffetService],
})
export class BuffetModule {}
