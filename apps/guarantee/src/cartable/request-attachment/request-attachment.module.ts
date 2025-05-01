import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RequestAttachmentService } from './request-attachment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequestAttachment } from '@rahino/localdatabase/models';
import { RequestAttachmentController } from './request-attachment.controller';
import { ReverseProxyGuaranteeRequestMiddleware } from './reverse-proxy.middleware';
import { MinioClientModule } from '@rahino/minio-client';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ConfigService } from '@nestjs/config';
import { Attachment } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([GSRequestAttachment, Attachment]),
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
  controllers: [RequestAttachmentController],
  providers: [RequestAttachmentService],
  exports: [RequestAttachmentService],
})
export class CartableRequestAttachmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyGuaranteeRequestMiddleware).forRoutes({
      path: '/v1/api/guarantee/cartable/requestAttachments/image/*',
      method: RequestMethod.GET,
    });
  }
}
