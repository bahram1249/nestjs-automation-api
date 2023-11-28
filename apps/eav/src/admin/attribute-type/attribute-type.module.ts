import { Module } from '@nestjs/common';
import { AttributeTypeService } from './attribute-type.service';
import { AttributeTypeController } from './attribute-type.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVAttributeType } from '@rahino/database/models/eav/eav-attribute-type.entity';

@Module({
  imports: [SequelizeModule.forFeature([EAVAttributeType])],
  controllers: [AttributeTypeController],
  providers: [AttributeTypeService],
})
export class AttributeTypeModule {}
