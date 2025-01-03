import {
  Body,
  Controller,
  Delete,
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
import { MenuDto, MenuGetDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { coverOptions } from './file-options';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
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
  @ApiOperation({ description: 'show all menus' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.menus.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: MenuGetDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: MenuGetDto) {
    return await this.service.findAll(filter);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show coffe menu by given id' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.menus.getone',
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
    permissionSymbol: 'discountcoffe.admin.menus.create',
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
  @ApiOperation({ description: 'update coffe menu' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.menus.update',
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
  @HttpCode(HttpStatus.OK)
  async edit(
    @Param('id') id: bigint,
    @GetUser() user: User,
    @Body() dto: MenuDto,
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

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'delete coffe menu by given id' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.menus.delete',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@GetUser() user: User, @Param('id') entityId: number) {
    return await this.service.deleteById(user, entityId);
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
