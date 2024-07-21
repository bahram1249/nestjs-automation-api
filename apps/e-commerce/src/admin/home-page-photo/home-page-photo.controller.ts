import {
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from '@rahino/auth/guard';
import { HomePagePhotoService } from './home-page-photo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './file-options';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('HomePagePhotos')
@Controller({
  path: '/api/ecommerce/homePagePhotos',
  version: ['1'],
})
export class HomePagePhotoController {
  constructor(private service: HomePagePhotoService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @CheckPermission({ permissionSymbol: 'ecommerce.homepagephotos.uploadImage' })
  @UseInterceptors(FileInterceptor('file', imageOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('/image')
  @HttpCode(HttpStatus.OK)
  async uploadImage(
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|png|jpeg)/ }),
          new MaxFileSizeValidator({ maxSize: 2097152 }),
        ],
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.service.uploadImage(user, file);
  }

  @CheckPermission({ permissionSymbol: 'ecommerce.homepagephotos.showImage' })
  @ApiOperation({ description: 'show home page photo by id' })
  @Get('/image/:id')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('id') attachmentId: bigint,
  ) {
    return await this.service.getPhoto(attachmentId, res);
  }
}
