import { Module } from '@nestjs/common';
import { RequestTypeController } from './request-type.controller';
import { RequestTypeService } from './request-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequestType } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSRequestType])],
  controllers: [RequestTypeController],
  providers: [RequestTypeService],
})
export class GSRequestTypeModule {}
