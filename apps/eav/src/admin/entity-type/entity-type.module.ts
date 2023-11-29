import { Module } from '@nestjs/common';
import { EntityTypeController } from './entity-type.controller';
import { EntityTypeService } from './entity-type.service';
import { EntityTypeProfile } from './mapper';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { EAVEntityModel } from '@rahino/database/models/eav/eav-entity-model.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      EAVEntityType,
      EAVEntityModel,
    ]),
  ],
  controllers: [EntityTypeController],
  providers: [EntityTypeService, EntityTypeProfile],
})
export class EntityTypeModule {}
