import * as sharp from 'sharp';

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  resizeOptions?: sharp.ResizeOptions;
}
