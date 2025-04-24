import { Module } from '@nestjs/common';
import { CartableRequestTypeService } from './request-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequestType } from '@rahino/localdatabase/models';
import { CartableRequestTypeController } from './request-type.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSRequestType])],
  controllers: [CartableRequestTypeController],
  providers: [CartableRequestTypeService],
  exports: [CartableRequestTypeService],
})
export class CartableRequestTypeModule {}
