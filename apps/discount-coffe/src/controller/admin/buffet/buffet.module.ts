import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { BuffetController } from './buffet.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { Buffet } from '@rahino/localdatabase/models';
import { BuffetType } from '@rahino/localdatabase/models';
import { BuffetCost } from '@rahino/localdatabase/models';
import { BuffetCity } from '@rahino/localdatabase/models';
import { CoffeOption } from '@rahino/localdatabase/models';
import { BuffetOption } from '@rahino/localdatabase/models';

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
