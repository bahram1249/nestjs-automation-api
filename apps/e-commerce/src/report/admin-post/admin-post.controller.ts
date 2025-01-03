import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { GetAdminPostDto } from './dto';
import { AdminPostService } from './admin-post.service';

@ApiTags('Report-AdminPost')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/adminPosts',
  version: ['1'],
})
export class AdminPostController {
  constructor(private service: AdminPostService) {}

  @ApiOperation({ description: 'show all posts report admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.adminposts.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetAdminPostDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetAdminPostDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show total admin post report' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.adminposts.getall',
  })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetAdminPostDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@Query() filter: GetAdminPostDto) {
    return await this.service.total(filter);
  }
}
