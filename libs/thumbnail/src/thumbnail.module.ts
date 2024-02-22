import { DynamicModule, Module } from '@nestjs/common';
import { ThumbnailService } from './thumbnail.service';
import { ThumbnailOptions } from './interface';
import { THUMBNAIL_OPTIONS_TOKEN } from './constants';
import ThumbnailAsyncOptions from './interface/thumbnail-option-async.type';

@Module({})
export class ThumbnailModule {
  static register(thumbnailOptions: ThumbnailOptions): DynamicModule {
    return {
      module: ThumbnailModule,
      providers: [
        {
          provide: THUMBNAIL_OPTIONS_TOKEN,
          useValue: thumbnailOptions,
        },
        ThumbnailService,
      ],
      exports: [ThumbnailService],
    };
  }
  static registerAsync(options: ThumbnailAsyncOptions): DynamicModule {
    return {
      module: ThumbnailModule,
      imports: options.imports,
      providers: [
        {
          provide: THUMBNAIL_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        ThumbnailService,
      ],
      exports: [ThumbnailService],
    };
  }
}
