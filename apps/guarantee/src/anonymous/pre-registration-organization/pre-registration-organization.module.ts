import { Module } from '@nestjs/common';
import { PreRegistrationOrganizationService } from './pre-registration-organization.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSPreRegistrationOrganization } from '@rahino/localdatabase/models';
import { PreRegistrationOrganizationController } from './pre-registration-organization.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { PreRegistrationOrganizationProfile } from './mapper';
import { Attachment } from '@rahino/database';
import { GSAddressModule } from '@rahino/guarantee/client/address/address.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PRE_REGISTRATION_INIT_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/pre-registration-init-sms-sender/constants';

@Module({
  imports: [
    LocalizationModule,
    SequelizeModule,
    GSAddressModule,
    SequelizeModule.forFeature([GSPreRegistrationOrganization, Attachment]),
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
      name: PRE_REGISTRATION_INIT_SMS_SENDER_QUEUE,
    }),
  ],
  controllers: [PreRegistrationOrganizationController],
  providers: [
    PreRegistrationOrganizationService,
    PreRegistrationOrganizationProfile,
  ],
})
export class AnonymousPreRegistrationOrganizationModule {}
