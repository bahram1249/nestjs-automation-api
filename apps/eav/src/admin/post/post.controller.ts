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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UnprocessableEntityException,
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

import { GetUser, JwtGuard } from '@rahino/auth';
import { PostDto, GetPostDto } from './dto';
import { PostService } from './post.service';
import { User } from '@rahino/database';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './file-options';

@ApiTags('EAV-Posts')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/eav/admin/posts',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PostController {
  constructor(private service: PostService) {}
  @ApiOperation({ description: 'show all posts' })
  @CheckPermission({ permissionSymbol: 'eav.admin.posts.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetPostDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetPostDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show post value by given id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.posts.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create post by blog id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.posts.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: PostDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update post by id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.posts.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: bigint, @Body() dto: PostDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete post by id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.posts.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: bigint) {
    return await this.service.deleteById(entityId);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @CheckPermission({ permissionSymbol: 'ecommerce.productphotos.uploadImage' })
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

    return await this.service.uploadImage(user, file);
  }
}
