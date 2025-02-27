import { Module } from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { BuffetController } from './buffet.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([Buffet])],
  providers: [BuffetService],
  controllers: [BuffetController],
})
export class BuffetModule {}
