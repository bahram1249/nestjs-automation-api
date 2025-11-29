import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { JwtGuard } from '@rahino/auth';
import { BasedAdminPostService } from './admin-post.service';
import { GetAdminPostDto } from '../../admin-post/dto';

@ApiTags('Report-AdminPosts-BasedLogistic')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/basedLogistic/adminPosts',
  version: ['1'],
})
export class BasedAdminPostController {
  constructor(private readonly service: BasedAdminPostService) {}

  @ApiOperation({ description: 'show all posts report admin (based-logistic)' })
  @CheckPermission({ permissionSymbol: 'ecommerce.report.adminposts.getall' })
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

  @ApiOperation({
    description: 'show total admin post report (based-logistic)',
  })
  @CheckPermission({ permissionSymbol: 'ecommerce.report.adminposts.getall' })
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
