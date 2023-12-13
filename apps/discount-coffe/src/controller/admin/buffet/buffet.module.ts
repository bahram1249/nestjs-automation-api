import { Module } from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { BuffetController } from './buffet.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { BuffetType } from '@rahino/database/models/discount-coffe/buffet-type.entity';
import { BuffetCost } from '@rahino/database/models/discount-coffe/buffet-cost.entity';
import { BuffetCity } from '@rahino/database/models/discount-coffe/city.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      Buffet,
      BuffetType,
      BuffetCost,
      BuffetCity,
    ]),
  ],
  controllers: [BuffetController],
  providers: [BuffetService],
})
export class BuffetModule {}
