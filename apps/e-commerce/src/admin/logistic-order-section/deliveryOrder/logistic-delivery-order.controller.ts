import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard, GetUser } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { User } from '@rahino/database';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { ListFilter } from '@rahino/query-filter';
import { LogisticDeliveryOrderService } from './logistic-delivery-order.service';

@ApiTags('Logistic-Delivery-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/logistic/deliveryOrders',
  version: ['1'],
})
export class LogisticDeliveryOrderController {
  constructor(private readonly service: LogisticDeliveryOrderService) {}

  @ApiOperation({ description: 'show all delivery orders' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.deliveryorders.getall',
  })
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

  @ApiOperation({ description: 'show delivery orders by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.deliveryorders.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @ApiOperation({
    description: 'change group to customer (id is ECLogisticOrderGrouped.id)',
  })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.deliveryorders.processdeliver',
  })
  @Patch('/processDelivery/:id')
  @HttpCode(HttpStatus.OK)
  async processPost(@Param('id') groupId: bigint, @GetUser() user: User) {
    return await this.service.processDelivery(groupId, user);
  }
}
