import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductVideoRemovalProcessor } from './product-video-removal.processor';
import { REMOVE_PRODUCT_VIDEO_QUEUE } from './constants';
import { MinioClientModule } from '@rahino/minio-client';
import { SequelizeModule } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database';
import { ProductVideoRemovalService } from './product-video-removal.service';
import { DBLoggerModule } from '@rahino/logger';

@Module({
  imports: [
    MinioClientModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: REMOVE_PRODUCT_VIDEO_QUEUE,
    }),
    SequelizeModule.forFeature([Attachment]),
    DBLoggerModule,
  ],
  providers: [ProductVideoRemovalService, ProductVideoRemovalProcessor],
})
export class ProductVideoRemovalModule {}
