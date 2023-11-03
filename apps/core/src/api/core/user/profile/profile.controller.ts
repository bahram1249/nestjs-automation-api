import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../../../../util/core/auth/guard';
import { JsonResponseTransformInterceptor } from 'apps/core/src/util/core/response/interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../../../../util/core/auth/decorator';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { profileFileOptions } from './file-options';
import type { Response } from 'express';

@ApiTags('User-Profile')
@Controller({
  path: '/api/core/user/profile',
  version: ['1'],
})
export class ProfileController {
  constructor(private service: ProfileService) {}
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ description: 'upload profile photo by user' })
  @Post('/photo')
  @UseInterceptors(FileInterceptor('file', profileFileOptions()))
  @UseInterceptors(JsonResponseTransformInterceptor)
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
  @HttpCode(HttpStatus.CREATED)
  async uploadPhoto(
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)/,
        })
        .addMaxSizeValidator({
          maxSize: 2097152,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return await this.service.upload(user.id, file);
  }

  @ApiOperation({ description: 'show profile photo by fileName' })
  @Get('/photo/:fileName')
  @HttpCode(HttpStatus.OK)
  async getPhoto(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ): Promise<StreamableFile> {
    return this.service.getPhoto(res, fileName);
  }
}
