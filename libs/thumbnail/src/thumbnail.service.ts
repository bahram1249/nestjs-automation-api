import { Inject, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
@Injectable()
export class ThumbnailService {
  constructor(
    @Inject('THUMBNAIL_OPTIONS')
    private readonly thumbnailOptions: {
      width?: number;
      height?: number;
      resizeOptions?: sharp.ResizeOptions;
    },
  ) {}
  async resize(
    filePath: string,
    width?: number,
    height?: number,
    resizeOptions?: sharp.ResizeOptions,
  ): Promise<Buffer> {
    const _width = width || this.thumbnailOptions.width || 1980;
    const _height = height || this.thumbnailOptions.height || 1080;
    const _options = resizeOptions || this.thumbnailOptions.resizeOptions;
    return await sharp(filePath).resize(_width, _height, _options).toBuffer();
  }
}
