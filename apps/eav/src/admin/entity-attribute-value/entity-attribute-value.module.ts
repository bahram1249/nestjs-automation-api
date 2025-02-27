import { Module } from '@nestjs/common';
import { EntityAttributeValueService } from './entity-attribute-value.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { EAVEntityAttribute } from '@rahino/localdatabase/models';
import { EAVAttributeValue } from '@rahino/localdatabase/models';
import { EAVAttribute } from '@rahino/localdatabase/models';
import { EAVEntityAttributeValue } from '@rahino/localdatabase/models';

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
