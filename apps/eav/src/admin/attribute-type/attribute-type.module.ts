import { Module } from '@nestjs/common';
import { AttributeTypeService } from './attribute-type.service';
import { AttributeTypeController } from './attribute-type.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVAttributeType } from '@rahino/database/models/eav/eav-attribute-type.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, EAVAttributeType])],
  controllers: [AttributeTypeController],
  providers: [AttributeTypeService],
})
export class AttributeTypeModule {}
