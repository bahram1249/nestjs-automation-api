import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSAssignedGuarantee, GSGuarantee } from '@rahino/localdatabase/models';
import { NormalGuaranteeService } from './normal-guarantee.service';
import { NormalGuaranteeController } from './normal-guarantee.controller';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
  controllers: [NormalGuaranteeController],
  providers: [NormalGuaranteeService],
})
export class ClientNormalGuaranteeModule {}
