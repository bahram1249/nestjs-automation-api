import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';
import { AgeService } from './age.service';
import { AgeController } from './age.controller';
import { PCMAge } from 'apps/core/src/database/sequelize/models/pcm/pcm-age.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PCMAge])],
  controllers: [AgeController],
  providers: [AgeService],
})
export class AgeModule {}
