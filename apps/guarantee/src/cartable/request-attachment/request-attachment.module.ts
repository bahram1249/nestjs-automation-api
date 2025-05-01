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

@Module({
  imports: [SequelizeModule, SequelizeModule.forFeature([GSRequestAttachment])],
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
