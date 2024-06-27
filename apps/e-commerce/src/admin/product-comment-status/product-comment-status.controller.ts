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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '@rahino/auth/decorator';
import { JwtGuard } from '@rahino/auth/guard';
import { User } from '@rahino/database/models/core/user.entity';
import { ListFilter } from '@rahino/query-filter';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { ProductCommentStatusService } from './product-comment-status.service';

@ApiTags('product comment status')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/productCommentStatuses',
  version: ['1'],
})
export class ProductCommentStatusController {
  constructor(private readonly service: ProductCommentStatusService) {}

  // public url
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.productcommentstatuses.getall',
  })
  @ApiOperation({ description: 'show all product comment statuses' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.findAll(user, filter);
  }

  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.productcommentstatuses.getone',
  })
  @ApiOperation({ description: 'show product comment status by given id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: number) {
    return await this.service.findById(user, entityId);
  }
}
