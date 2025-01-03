import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Res,
  StreamableFile,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { JwtGuard } from '@rahino/auth';
import { ListFilter } from '@rahino/query-filter';
import { BuffetService } from './buffet.service';
import { BuffetDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { coverOptions } from './file-options';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('DiscountCoffe-Buffets')
@ApiBearerAuth()
@Controller({
  path: '/api/discountcoffe/admin/buffets',
  version: ['1'],
})
export class BuffetController {
  constructor(private service: BuffetService) {}
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show all buffets' })
  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show buffets by given id' })
  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'create buffets' })
  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.create' })
  @UseInterceptors(FileInterceptor('file', coverOptions()))
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
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: User,
    @Body() dto: BuffetDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ }),
          new MaxFileSizeValidator({ maxSize: 2097152 }),
        ],
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.service.create(user, dto, file);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'update buffets' })
  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.update' })
  @UseInterceptors(FileInterceptor('file', coverOptions()))
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
  @Put('/:id')
  @HttpCode(HttpStatus.CREATED)
  async edit(
    @Param('id') id: bigint,
    @GetUser() user: User,
    @Body() dto: BuffetDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ }),
          new MaxFileSizeValidator({ maxSize: 2097152 }),
        ],
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.service.edit(id, user, dto, file);
  }

  @ApiOperation({ description: 'show buffet photo by fileName' })
  @Get('/photo/:fileName')
  async photo(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ): Promise<StreamableFile> {
    return this.service.getPhoto(res, fileName);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'upload gallery' })
  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.getone' })
  @UseInterceptors(FileInterceptor('file', coverOptions()))
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
  @Post('/uploadGallery')
  @HttpCode(HttpStatus.CREATED)
  async uploadGallery(
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ }),
          new MaxFileSizeValidator({ maxSize: 2097152 }),
        ],
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.service.uploadGallery(user, file);
  }

  @ApiOperation({ description: 'show buffet gallery by fileName' })
  @Get('/gallery/:fileName')
  async showGallery(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ): Promise<StreamableFile> {
    return this.service.showGallery(res, fileName);
  }
}
