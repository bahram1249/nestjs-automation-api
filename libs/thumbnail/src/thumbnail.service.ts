import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
@Injectable()
export class ThumbnailService {
  constructor() {}
  async resize(
    filePath: string,
    width: number = 1980,
    height: number = 1080,
  ): Promise<Buffer> {
    return await sharp(filePath).resize(width, height).toBuffer();
  }
}
