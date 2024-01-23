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

import { JwtGuard } from '@rahino/auth/guard';
import { EntityTypeDto, GetEntityTypeDto } from './dto';
import { EntityTypeService } from './entity-type.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';
import { imageOptions } from './file-options';
import { Response } from 'express';

@ApiTags('EAV-EntityTypes')
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/eav/admin/entityTypes',
  version: ['1'],
})
export class EntityTypeController {
  constructor(private service: EntityTypeService) {}

  @ApiOperation({ description: 'show all entitytypes' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetEntityTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetEntityTypeDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show attribute by given id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create entity type by modeltypeid' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: EntityTypeDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update entity type' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') entityId: number, @Body() dto: EntityTypeDto) {
    return await this.service.update(entityId, dto);
  }

  @ApiOperation({ description: 'delete by entitytypeid' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.uploadImage' })
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
  @Post('/image/:id')
  @HttpCode(HttpStatus.OK)
  async uploadImage(
    @Param('id') id: number,
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
    return await this.service.uploadImage(id, user, file);
  }

  @ApiOperation({ description: 'show guarantee photo by fileName' })
  @Get('/image/:fileName')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ) {
    return this.service.getPhoto(res, fileName);
  }
}
