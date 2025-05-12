import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PublicPhotoService } from './public-photo.service';

@ApiTags('PublicPhoto')
@Controller({
  path: '/api/client/ecommerce/publicPhotos',
  version: ['1'],
})
export class PublicPhotoController {
  constructor(private service: PublicPhotoService) {}

  @ApiOperation({ description: 'show public photo by fileName' })
  @Get('/image/:fileName')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ) {
    return {
      ok: true,
    };
  }
}
