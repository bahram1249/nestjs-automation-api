import { Module } from '@nestjs/common';
import { EntityAttributeValueService } from './entity-attribute-value.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { EAVEntityAttribute } from '@rahino/database/models/eav/eav-entity-attribute.entity';
import { EAVAttributeValue } from '@rahino/database/models/eav/eav-attribute-value';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { EAVEntityAttributeValue } from '@rahino/database/models/eav/eav-entity-attribute-value.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EAVEntityType,
      EAVEntityAttribute,
      EAVAttributeValue,
      EAVAttribute,
      EAVEntityAttributeValue,
    ]),
  ],
  providers: [EntityAttributeValueService],
  exports: [EntityAttributeValueService],
})
export class EntityAttributeValueModule {}
