import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GuaranteeController } from './guarantee.controller';
import { GuaranteeService } from './guarantee.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { GuaranteeProfile } from './mapper';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { MinioClientModule } from '@rahino/minio-client';
import { ReverseProxyGuaranteeImageMiddleware } from './reverse-proxy.middleware';
import { ThumbnailModule } from '@rahino/thumbnail';
import { ConfigService } from '@nestjs/config';
import { SessionModule } from '../user/session/session.module';

@Module({
  imports: [
    SessionModule,
    SequelizeModule.forFeature([User, Permission, ECGuarantee, Attachment]),
    MinioClientModule,
    ThumbnailModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        height: parseInt(config.get('GUARANTEE_IMAGE_HEIGHT')) || 700,
        width: parseInt(config.get('GUARANTEE_IMAGE_WIDTH')) || 700,
        resizeOptions: {
          withoutEnlargement: true,
          withoutReduction: true,
        },
      }),
    }),
  ],
  controllers: [GuaranteeController],
  providers: [GuaranteeService, GuaranteeProfile],
})
export class GuaranteeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReverseProxyGuaranteeImageMiddleware).forRoutes({
      path: '/v1/api/ecommerce/guarantees/image/*',
      method: RequestMethod.GET,
    });
  }
}
