import { Module } from '@nestjs/common';
import { AttributeValueController } from './attribute-value.controller';
import { AttributeValueService } from './attribute-value.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { AttributeValueProfile } from './mapper';
import { EAVAttributeValue } from '@rahino/database/models/eav/eav-attribute-value';

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
