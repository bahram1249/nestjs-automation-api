import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSGuarantee } from '@rahino/localdatabase/models';
import { GuaranteeCheckService } from './guarantee-check.service';
import { GuaranteeCheckController } from './guarantee-check.controller';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CLIENT_SUBMIT_CARD_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-submit-card-sms-sender/constants';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSGuarantee]),
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
    LocalizationModule,
  ],
  controllers: [GuaranteeCheckController],
  providers: [GuaranteeCheckService],
})
export class GSAnonymousCheckModule {}
