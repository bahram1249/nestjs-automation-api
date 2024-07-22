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
import { HomePhotoService } from './home-photo.service';

@ApiTags('HomePhotos')
@Controller({
  path: '/api/ecommerce/homePhotos',
  version: ['1'],
})
export class HomePhotoController {
  constructor(private service: HomePhotoService) {}

  @ApiOperation({ description: 'show home photo by fileName' })
  @Get('/image/:fileName')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('filename') fileName: string,
  ) {
    return {
      result: 'ok',
    };
  }
}
