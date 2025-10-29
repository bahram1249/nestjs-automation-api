import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { IrangsImportDataService } from './irangs-import-data.service';
import { GetUser, JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { User } from '@rahino/database/models/core/user.entity';
import { IrangsImportDataGetDto } from './dto';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-IrangsImportData')
@Controller({
  path: '/api/guarantee/admin/irangs-import-data',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class IrangsImportDataController {
  constructor(private service: IrangsImportDataService) {}

  @ApiOperation({ description: 'get all irangs import data' })
  @CheckPermission({
    permissionSymbol: 'guarantee.admin.irangs-import-data.getall',
  })
  @Get()
  async findAll(@Query() dto: IrangsImportDataGetDto) {
    return this.service.findAll(dto);
  }

  @ApiOperation({ description: 'upload excel file' })
  @CheckPermission({
    permissionSymbol: 'guarantee.admin.irangs-import-data.create',
  })
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './temp',
      }),
    }),
  )
  @Post('/upload')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20971520 }),
          new FileTypeValidator({
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.service.upload(file, user);
  }

  @ApiOperation({ description: 'download excel file by import data id' })
  @CheckPermission({
    permissionSymbol: 'guarantee.admin.irangs-import-data.download',
  })
  @Get('/:id/download')
  async download(@Param('id') id: bigint, @Res() res: Response) {
    const { buffer, fileName } = await this.service.download(id);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(buffer);
  }
}
