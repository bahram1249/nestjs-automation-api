import {
  Body,
  Controller,
  Delete,
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
  UnprocessableEntityException,
  Version,
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

import { JwtGuard } from '@rahino/auth';
import { EntityTypeDto, EntityTypeV2Dto, GetEntityTypeDto } from './dto';
import { EntityTypeService } from './entity-type.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { imageOptions } from './file-options';
import { Response } from 'express';

@ApiTags('EAV-EntityTypes')
@Controller({
  path: '/api/eav/admin/entityTypes',
  version: ['1'],
})
export class EntityTypeController {
  constructor(private service: EntityTypeService) {}

  //@ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  //@UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show all entitytypes' })
  //@CheckPermission({ permissionSymbol: 'eav.admin.entitytype.getall' })
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

  //@ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  //@UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show all entitytypes' })
  @Version('2')
  //@CheckPermission({ permissionSymbol: 'eav.admin.entitytype.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetEntityTypeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAllV2(@Query() filter: GetEntityTypeDto) {
    return await this.service.findAllV2(filter);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show attribute by given slug' })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }

  @Version('2')
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show attribute by given slug' })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlugV2(@Param('slug') slug: string) {
    return await this.service.findBySlugV2(slug);
  }

  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show attribute by given id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @Version('2')
  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show attribute by given id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findByIdV2(@Param('id') entityId: number) {
    return await this.service.findByIdV2(entityId);
  }

  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'create entity type by modeltypeid' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: EntityTypeDto) {
    return await this.service.create(dto);
  }

  @Version('2')
  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'create entity type by modeltypeid' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createV2(@Body() dto: EntityTypeV2Dto) {
    return await this.service.createV2(dto);
  }

  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'update entity type' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') entityId: number, @Body() dto: EntityTypeV2Dto) {
    return await this.service.update(entityId, dto);
  }

  @Version('2')
  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'update entity type' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateV2(@Param('id') entityId: number, @Body() dto: EntityTypeV2Dto) {
    return await this.service.updateV2(entityId, dto);
  }

  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'delete by entitytypeid' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitytype.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
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
        validators: [new MaxFileSizeValidator({ maxSize: 2097152 })],
        fileIsRequired: false,
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

    return await this.service.uploadImage(id, user, file);
  }

  @ApiOperation({ description: 'show guarantee photo by fileName' })
  @Get('/image/:fileName')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ) {
    return { ok: true };
  }
}
