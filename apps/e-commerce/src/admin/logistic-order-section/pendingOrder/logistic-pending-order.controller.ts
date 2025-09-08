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
import { GetOrderDto } from 'apps/e-commerce/src/admin/order-section/pendingOrder/dto';
import { LogisticPendingOrderService } from './logistic-pending-order.service';

@ApiTags('Logistic-Pending-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/logistic/pendingOrders',
  version: ['1'],
})
export class LogisticPendingOrderController {
  constructor(private readonly service: LogisticPendingOrderService) {}

  @ApiOperation({ description: 'show all pending orders' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.pendingorders.getall' })
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

  @ApiOperation({ description: 'show pending orders by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.pendingorders.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id') entityId: bigint,
    @GetUser() user: User,
    @Query() filter: GetOrderDto,
  ) {
    return await this.service.findById(entityId, user, filter);
  }

  @ApiOperation({ description: 'change detail to process' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.pendingorders.processdetail',
  })
  @Patch('/processDetail/:id')
  @HttpCode(HttpStatus.OK)
  async processDetail(@Param('id') detailId: bigint, @GetUser() user: User) {
    return await this.service.processDetail(detailId, user);
  }
}
