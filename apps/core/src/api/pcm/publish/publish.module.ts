import { Module } from '@nestjs/common';
import { PublishService } from './publish.service';
import { PublishController } from './publish.controller';
import { SequelizeModule } from '@nestjs/sequelize';

import { PCMPublish } from 'apps/core/src/database/sequelize/models/pcm/pcm-publish.entity';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PCMPublish])],
  controllers: [PublishController],
  providers: [PublishService],
})
export class PublishModule {}
