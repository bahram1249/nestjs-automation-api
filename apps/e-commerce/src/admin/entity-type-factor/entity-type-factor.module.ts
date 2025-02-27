import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECEntityTypeFactor } from '@rahino/localdatabase/models';
import { EntityTypeFactorService } from './entity-type-factor.service';
import { EntityTypeFactorController } from './entity-type-factor.controller';
import { EntityTypFactorProfile } from './mapper';
import { EAVEntityType } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECEntityTypeFactor,
      EAVEntityType,
    ]),
  ],
  controllers: [EntityTypeFactorController],
  providers: [EntityTypeFactorService, EntityTypFactorProfile],
})
export class EntityTypeFactorModule {}
