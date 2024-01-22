import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          endPoint: config.get('MINIO_ENDPOINT'),
          port: parseInt(config.get('MINIO_PORT')),
          useSSL: config.get('MINIO_SSL') === 'true',
          accessKey: config.get('MINIO_ACCESS_KEY'),
          secretKey: config.get('MINIO_SECRET_KEY'),
        };
      },
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
