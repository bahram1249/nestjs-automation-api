import { Module } from '@nestjs/common';
import { EntityModelController } from './entity-model.controller';
import { EntityModelService } from './entity-model.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { EAVEntityModel } from '@rahino/database/models/eav/eav-entity-model.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, EAVEntityModel])],
  controllers: [EntityModelController],
  providers: [EntityModelService],
})
export class EntityModelModule {}
