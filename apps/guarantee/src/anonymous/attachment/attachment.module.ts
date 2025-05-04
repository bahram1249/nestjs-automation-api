import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ReverseProxyTempAttachmentMiddleware } from './reverse-proxy.middleware';

@Module({
  imports: [
    SequelizeModule.forFeature([Attachment]),
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
  controllers: [AttachmentController],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class GSAnonymousAttachmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyTempAttachmentMiddleware).forRoutes({
      path: '/v1/api/guarantee/anonymous/attachments/image/*',
      method: RequestMethod.GET,
    });
  }
}
