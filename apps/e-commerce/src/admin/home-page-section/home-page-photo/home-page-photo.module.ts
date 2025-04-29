import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HomePagePhotoController } from './home-page-photo.controller';
import { HomePagePhotoService } from './home-page-photo.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { MinioClientModule } from '@rahino/minio-client';
import { Attachment } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, Attachment]),
    MinioClientModule,
    // ThumbnailModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     //height: parseInt(config.get('PRODUCT_PHOTO_IMAGE_HEIGHT')) || 700,
    //     //width: parseInt(config.get('PRODUCT_PHOTO_IMAGE_WIDTH')) || 700,
    //     resizeOptions: {
    //       withoutEnlargement: true,
    //       withoutReduction: true,
    //     },
    //   }),
    // }),
  ],
  controllers: [HomePagePhotoController],
  providers: [HomePagePhotoService],
  exports: [HomePagePhotoService],
})
export class HomePagePhotoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
