import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { ECEntityTypeFactor } from '@rahino/database/models/ecommerce-eav/ec-entitytype-factor.entity';
import { EntityTypeFactorService } from './entity-type-factor.service';
import { EntityTypeFactorController } from './entity-type-factor.controller';
import { EntityTypFactorProfile } from './mapper';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';

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
