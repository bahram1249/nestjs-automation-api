import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { GetBlogPublishDto } from './dto';
import { BlogPublishService } from './blog-publish.service';

@ApiTags('EAV-BlogPublishes')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/eav/admin/blogPublishes',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class BlogPublishController {
  constructor(private service: BlogPublishService) {}
  @ApiOperation({ description: 'show all blog publishes' })
  @CheckPermission({ permissionSymbol: 'eav.admin.blogpublishes.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetBlogPublishDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetBlogPublishDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show blog publish by given id' })
  @CheckPermission({ permissionSymbol: 'eav.admin.blogpublishes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}
