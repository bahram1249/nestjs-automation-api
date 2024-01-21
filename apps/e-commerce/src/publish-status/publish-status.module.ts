import { Module } from '@nestjs/common';
import { PublishStatusController } from './publish-status.controller';
import { PublishStatusService } from './publish-status.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPublishStatus } from '@rahino/database/models/ecommerce-eav/ec-publish-status.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECPublishStatus])],
  controllers: [PublishStatusController],
  providers: [PublishStatusService],
})
export class PublishStatusModule {}
