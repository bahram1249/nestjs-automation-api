import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSAssignedGuarantee, GSGuarantee } from '@rahino/localdatabase/models';
import { VipGuaranteeService } from './vip-guarantee.service';
import { VipGuaranteeController } from './vip-guarantee.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { CLIENT_SUBMIT_CARD_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-submit-card-sms-sender/constants';

@Module({
  imports: [
    SequelizeModule.forFeature([GSGuarantee, GSAssignedGuarantee]),
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
      name: CLIENT_SUBMIT_CARD_SMS_SENDER_QUEUE,
    }),
  ],
  controllers: [VipGuaranteeController],
  providers: [VipGuaranteeService],
})
export class ClientVipGuaranteeModule {}
