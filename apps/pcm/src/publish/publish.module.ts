import { Module } from '@nestjs/common';
import { PublishService } from './publish.service';
import { PublishController } from './publish.controller';
import { SequelizeModule } from '@nestjs/sequelize';

import { PCMPublish } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PCMPublish])],
  controllers: [PublishController],
  providers: [PublishService],
})
export class PublishModule {}
