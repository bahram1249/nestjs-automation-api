import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductImageRemovalProcessor } from './product-image-removal.processor';
import { REMOVE_PRODUCT_PHOTO_QUEUE } from './constants';
import { MinioClientModule } from '@rahino/minio-client';
import { SequelizeModule } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database';
import { ProductImageRemovalService } from './product-image-removal.service';
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
      name: REMOVE_PRODUCT_PHOTO_QUEUE,
    }),
    SequelizeModule.forFeature([Attachment]),
    DBLoggerModule,
  ],
  providers: [ProductImageRemovalService, ProductImageRemovalProcessor],
})
export class ProductImageRemovalModule {}
