import { DynamicModule, Module } from '@nestjs/common';
import { ThumbnailService } from './thumbnail.service';
import * as sharp from 'sharp';

@Module({})
export class ThumbnailModule {
  static register(thumbnailOptions: {
    width?: number;
    height?: number;
    resizeOptions?: sharp.ResizeOptions;
  }): DynamicModule {
    return {
      module: ThumbnailModule,
      providers: [
        {
          provide: 'THUMBNAIL_OPTIONS',
          useValue: thumbnailOptions,
        },
        ThumbnailService,
      ],
      exports: [ThumbnailService],
    };
  }
}
