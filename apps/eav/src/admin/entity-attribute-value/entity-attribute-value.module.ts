import { Module } from '@nestjs/common';
import { EntityAttributeValueService } from './entity-attribute-value.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVEntityType } from '@rahino/database';
import { EAVEntityAttribute } from '@rahino/database';
import { EAVAttributeValue } from '@rahino/database';
import { EAVAttribute } from '@rahino/database';
import { EAVEntityAttributeValue } from '@rahino/database';

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
