import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
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
import { CourierProcessDto } from 'apps/e-commerce/src/admin/order-section/courierOrder/dto';
import { LogisticCourierOrderService } from './logistic-courier-order.service';

@ApiTags('Logistic-Courier-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/logistic/courierOrders',
  version: ['1'],
})
export class LogisticCourierOrderController {
  constructor(private readonly service: LogisticCourierOrderService) {}

  @ApiOperation({ description: 'show all courier orders' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.courierorders.getall',
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

  @ApiOperation({ description: 'show courier orders by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.courierorders.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @ApiOperation({
    description: 'change group to courier (id is ECLogisticOrderGrouped.id)',
  })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.courierorders.processcourier',
  })
  @Patch('/processCourier/:id')
  @HttpCode(HttpStatus.OK)
  async processCourier(
    @Param('id') groupId: bigint,
    @GetUser() user: User,
    @Body() dto: CourierProcessDto,
  ) {
    return await this.service.processCourier(groupId, user, dto);
  }
}
