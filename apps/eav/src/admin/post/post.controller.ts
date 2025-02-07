import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth';
import { PostDto, GetPostDto } from './dto';
import { PostService } from './post.service';

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
}
