import { Module } from '@nestjs/common';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { EAVEntityAttribute } from '@rahino/database/models/eav/eav-entity-attribute.entity';
import { AttributeProfile } from './mapper';
import { EAVAttributeType } from '@rahino/database/models/eav/eav-attribute-type.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      EAVAttribute,
      EAVAttributeType,
      EAVEntityAttribute,
      EAVEntityType,
    ]),
  ],
  providers: [AttributeService, AttributeProfile],
  controllers: [AttributeController],
})
export class AttributeModule {}
