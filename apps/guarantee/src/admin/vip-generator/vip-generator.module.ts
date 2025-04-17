import { Module } from '@nestjs/common';
import { VipGeneratorService } from './vip-generator.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSGuarantee,
  GSVipBundleType,
  GSVipGenerator,
} from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { VipGeneratorController } from './vip-generator.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VIP_GENERATOR_QUEUE } from '@rahino/guarantee/job/vip-generator-job/constants';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSVipBundleType,
      GSVipGenerator,
      User,
      Permission,
      GSGuarantee,
    ]),
    LocalizationModule,
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
    }),
  ],
  controllers: [VipGeneratorController],
  providers: [VipGeneratorService],
  exports: [VipGeneratorService],
})
export class GSVipGeneratorModule {}
