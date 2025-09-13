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
import { GetBasedAdminPostDto } from './dto';
import { BasedAdminPostService } from './admin-post.service';

@ApiTags('Report-BasedAdminPost')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/based-logistic/adminPosts',
  version: ['1'],
})
export class BasedAdminPostController {
  constructor(private service: BasedAdminPostService) {}

  @ApiOperation({ description: 'show all posts report admin (based-logistic)' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.adminposts.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetBasedAdminPostDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetBasedAdminPostDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show total admin post report (based-logistic)' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.adminposts.getall',
  })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetBasedAdminPostDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@Query() filter: GetBasedAdminPostDto) {
    return await this.service.total(filter);
  }
}
