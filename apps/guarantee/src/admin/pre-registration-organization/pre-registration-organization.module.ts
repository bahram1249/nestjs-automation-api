import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PreRegistrationOrganizationService } from './pre-registration-organization.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSPreRegistrationOrganization } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { PreRegistrationOrganizationController } from './pre-registration-organization.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GuaranteeOrganizationModule } from '../guarantee-organization';
import { GuaranteeOrganizationContractModule } from '../guarantee-organization-contract';
import { ReverseProxyOrganizationAttachmentMiddleware } from './reverse-proxy.middleware';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PRE_REGISTRATION_SUCESS_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/pre-registration-sucess-sms-sender/constants';
import { PRE_REGISTRATION_REJECT_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/pre-registration-reject-description-sms-sender/constants';

@Module({
  imports: [
    GuaranteeOrganizationModule,
    GuaranteeOrganizationContractModule,
    LocalizationModule,
    SequelizeModule.forFeature([
      GSPreRegistrationOrganization,
      User,
      Permission,
    ]),
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
      name: PRE_REGISTRATION_SUCESS_SMS_SENDER_QUEUE,
    }),
    BullModule.registerQueueAsync({
      name: PRE_REGISTRATION_REJECT_SMS_SENDER_QUEUE,
    }),
  ],
  controllers: [PreRegistrationOrganizationController],
  providers: [PreRegistrationOrganizationService],
  exports: [PreRegistrationOrganizationService],
})
export class AdminPreRegistrationOrganizationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyOrganizationAttachmentMiddleware).forRoutes({
      path: '/v1/api/guarantee/admin/preRegistrationOrganizations/image/*',
      method: RequestMethod.GET,
    });
  }
}
