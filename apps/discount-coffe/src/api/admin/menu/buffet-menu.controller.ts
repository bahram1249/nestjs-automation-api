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

import { JwtGuard } from '@rahino/auth/guard';
import { ListFilter } from '@rahino/query-filter';
import { MenuDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { coverOptions } from './file-options';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';
import { BuffetMenuService } from './buffet-menu.service';

@ApiTags('DiscountCoffe-MenuCategories')
@ApiBearerAuth()
@Controller({
  path: '/api/discountcoffe/admin/menus',
  version: ['1'],
})
export class BuffetMenuController {
  constructor(private service: BuffetMenuService) {}
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show all coffemenus' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.coffemenus.getall',
  })
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
  @ApiOperation({ description: 'show coffe menu by given id' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.coffemenus.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'create coffe menu' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.coffemenus.create',
  })
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
    @Body() dto: MenuDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|png)/ }),
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
  @ApiOperation({ description: 'update coffe menu' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.coffemenus.update',
  })
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
    @Body() dto: MenuDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|png)/ }),
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

  @ApiOperation({ description: 'show coffe menu photo by fileName' })
  @Get('/photo/:fileName')
  async photo(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ): Promise<StreamableFile> {
    return this.service.getPhoto(res, fileName);
  }
}
