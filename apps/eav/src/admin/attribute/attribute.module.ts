import { Module } from '@nestjs/common';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { EAVAttribute } from '@rahino/database';
import { EAVEntityAttribute } from '@rahino/database';
import { AttributeProfile } from './mapper';
import { EAVAttributeType } from '@rahino/database';
import { EAVEntityType } from '@rahino/database';

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
