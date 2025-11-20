import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttachmentService } from './attachment.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './file-options';

@ApiTags('GS-Anonymous-Attachments')
@Controller({
  path: '/api/guarantee/anonymous/attachments',
  version: ['1'],
})
export class AttachmentController {
  constructor(private service: AttachmentService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
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
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10097152 })],
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file && !['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new UnprocessableEntityException(
        `Validation failed (current file type is ${file.mimetype}, expected type is /(jpg|png|jpeg)/)`,
      );
    }

    return await this.service.uploadImage(file);
  }

  @ApiOperation({ description: 'show attachment  photo by fileName' })
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
