import { Module } from '@nestjs/common';
import { BuffetController } from './buffet.controller';
import { BuffetService } from './buffet.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { BuffetMenuCategory } from '@rahino/database/models/discount-coffe/buffet-menu-category.entity';

@Module({
  imports: [SequelizeModule.forFeature([Buffet, BuffetMenuCategory])],
  controllers: [BuffetController],
  providers: [BuffetService],
})
export class BuffetModule {}
