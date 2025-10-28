import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNPROCESS,
  GSAssignedGuarantee,
  GSRequest,
  GSRequestAttachment,
  GSRequestItem,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { BPMNRequestModule } from '@rahino/bpmn/modules/request/request.module';
import { GSAddressModule } from '../address/address.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NORMAL_GUARANTEE_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/normal-guarantee-request-sms-sender/constants';
import { GSClientAssignedProductAssignedGuaranteeModule } from '../assigned-product-guarantee/assigned-product-guarantee.module';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ReverseProxyGuaranteeRequestMiddleware } from './reverse-proxy.middleware';

@Module({
  imports: [
    SequelizeModule,
    BPMNRequestModule,
    GSAddressModule,
    SequelizeModule.forFeature([
      GSRequest,
      GSAssignedGuarantee,
      BPMNPROCESS,
      Attachment,
      GSRequestAttachment,
      GSRequestItem,
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
      name: NORMAL_GUARANTEE_REQUEST_SMS_SENDER_QUEUE,
    }),
    GSClientAssignedProductAssignedGuaranteeModule,
    MinioClientModule,
    ThumbnailModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        resizeOptions: {
          withoutEnlargement: false,
          withoutReduction: true,
          fit: 'fill',
          position: 'center',
        },
      }),
    }),
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class GSClientRequestModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyGuaranteeRequestMiddleware).forRoutes({
      path: '/v1/api/guarantee/client/requests/image/*',
      method: RequestMethod.GET,
    });
  }
}
