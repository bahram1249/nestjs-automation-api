import { Module } from '@nestjs/common';
import { AttributeTypeService } from './attribute-type.service';
import { AttributeTypeController } from './attribute-type.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVAttributeType } from '@rahino/localdatabase/models';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, EAVAttributeType])],
  controllers: [AttributeTypeController],
  providers: [AttributeTypeService],
})
export class AttributeTypeModule {}
