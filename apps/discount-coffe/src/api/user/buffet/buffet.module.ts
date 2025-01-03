import { Module } from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { BuffetController } from './buffet.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buffet } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([Buffet])],
  providers: [BuffetService],
  controllers: [BuffetController],
})
export class BuffetModule {}
