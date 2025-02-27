import { Module } from '@nestjs/common';
import { EntityModelController } from './entity-model.controller';
import { EntityModelService } from './entity-model.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { EAVEntityModel } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, EAVEntityModel])],
  controllers: [EntityModelController],
  providers: [EntityModelService],
})
export class EntityModelModule {}
