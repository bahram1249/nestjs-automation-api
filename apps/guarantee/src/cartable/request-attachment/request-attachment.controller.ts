import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { RequestAttachmentService } from './request-attachment.service';
import { GSRequestAttachmentDto } from './dto';
import { User } from '@rahino/database';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './file-options';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-RequestAttachment')
@Controller({
  path: '/api/guarantee/cartable/requestAttachments',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class RequestAttachmentController {
  constructor(private service: RequestAttachmentService) {}

  @ApiOperation({ description: 'show all attachments for a request. ' })
  @Get('/requestId/:requestId')
  @ApiQuery({
    name: 'filter',
    type: GSRequestAttachmentDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('requestId') requestId: bigint,
    @Query() filter: GSRequestAttachmentDto,
  ) {
    return await this.service.findAll(requestId, filter);
  }

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

    return await this.service.uploadImage(user, file);
  }

  @ApiOperation({ description: 'show request guarantee photo by fileName' })
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
