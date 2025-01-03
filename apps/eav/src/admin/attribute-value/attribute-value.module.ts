import { Module } from '@nestjs/common';
import { AttributeValueController } from './attribute-value.controller';
import { AttributeValueService } from './attribute-value.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { EAVAttribute } from '@rahino/database';
import { AttributeValueProfile } from './mapper';
import { EAVAttributeValue } from '@rahino/database';

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
