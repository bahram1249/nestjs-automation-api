import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
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
import { JwtGuard } from '@rahino/auth/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';
import { GetOrderDto } from './dto';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';

@ApiTags('Admin-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/orders',
  version: ['1'],
})
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @ApiOperation({ description: 'show all orders' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.orders.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetOrderDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetOrderDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show orders by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.orders.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id') entityId: bigint,
    @GetUser() user: User,
    @Query() filter: GetOrderDto,
  ) {
    return await this.service.findById(entityId, user, filter);
  }
}
