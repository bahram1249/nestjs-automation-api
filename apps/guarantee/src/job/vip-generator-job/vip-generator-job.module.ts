import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VipGeneratorProcessor } from './processor';
import { VIP_GENERATOR_QUEUE } from './constants';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSGuarantee,
  GSVipBundleType,
  GSVipGenerator,
} from '@rahino/localdatabase/models';
import { RialPriceModule } from '@rahino/guarantee/shared/rial-price';

@Module({
  imports: [
    SequelizeModule.forFeature([GSGuarantee, GSVipBundleType, GSVipGenerator]),
    RialPriceModule,
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
    BullModule.registerQueueAsync({
      name: VIP_GENERATOR_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  providers: [VipGeneratorProcessor],
})
export class VipGeneratorJobModule {}
