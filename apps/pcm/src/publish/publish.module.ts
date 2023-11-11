import { Module } from '@nestjs/common';
import { PublishService } from './publish.service';
import { PublishController } from './publish.controller';
import { SequelizeModule } from '@nestjs/sequelize';

import { PCMPublish } from '@rahino/database/models/pcm/pcm-publish.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PCMPublish])],
  controllers: [PublishController],
  providers: [PublishService],
})
export class PublishModule {}
