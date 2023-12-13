import { Module } from '@nestjs/common';
import { BuffetController } from './buffet.controller';
import { BuffetService } from './buffet.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';

@Module({
  imports: [SequelizeModule.forFeature([Buffet])],
  controllers: [BuffetController],
  providers: [BuffetService],
})
export class BuffetModule {}
