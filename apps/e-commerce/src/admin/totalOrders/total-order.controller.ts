import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TotalOrderService } from './total-order.service';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '@rahino/auth/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('Total-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/totalOrders',
  version: ['1'],
})
export class TotalOrderController {
  constructor(private readonly service: TotalOrderService) {}

  @ApiOperation({ description: 'show all total orders' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.totalorders.getall' })
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

  @ApiOperation({ description: 'show total orders by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.totalorders.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @ApiOperation({ description: 'delete detail order' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.totalorders.removedetail',
  })
  @Delete('/removeDetail/:id')
  @HttpCode(HttpStatus.OK)
  async removeDetail(@Param('id') detailId: bigint, @GetUser() user: User) {
    return await this.service.removeDetail(detailId, user);
  }

  @ApiOperation({ description: 'delete order by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.totalorders.delete',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async removeById(@Param('id') id: bigint, @GetUser() user: User) {
    return await this.service.removeById(id);
  }
}
