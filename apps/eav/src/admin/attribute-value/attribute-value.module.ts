import { Module } from '@nestjs/common';
import { AttributeValueController } from './attribute-value.controller';
import { AttributeValueService } from './attribute-value.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { EAVAttribute } from '@rahino/localdatabase/models';
import { AttributeValueProfile } from './mapper';
import { EAVAttributeValue } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      EAVAttributeValue,
      EAVAttribute,
    ]),
  ],
  providers: [AttributeValueService, AttributeValueProfile],
  controllers: [AttributeValueController],
})
export class AttributeValueModule {}
