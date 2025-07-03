import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CourierOrderService } from './courier-order.service';
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
  Version,
} from '@nestjs/common';
import { JwtGuard } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { ListFilter } from '@rahino/query-filter';
import { CourierProcessDto } from './dto';

@ApiTags('Courier-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/courierOrders',
  version: ['1'],
})
export class CourierOrderController {
  constructor(private readonly service: CourierOrderService) {}

  @ApiOperation({ description: 'show all courier orders' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.courierorders.getall' })
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

  @Version('2')
  @ApiOperation({ description: 'show all courier orders' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.courierorders.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAllV2(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.findAllV2(user, filter);
  }

  @ApiOperation({ description: 'show courier orders by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.courierorders.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @Version('2')
  @ApiOperation({ description: 'show courier orders by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.courierorders.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findByIdV2(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findByIdV2(entityId, user);
  }

  @ApiOperation({ description: 'change order to courier' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.courierorders.processcourier',
  })
  @Patch('/processCourier/:id')
  @HttpCode(HttpStatus.OK)
  async processCourier(
    @Param('id') orderId: bigint,
    @GetUser() user: User,
    @Body() dto: CourierProcessDto,
  ) {
    return await this.service.processCourier(orderId, user, dto);
  }

  @Version('2')
  @ApiOperation({ description: 'change order to courier' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.courierorders.processcourier',
  })
  @Patch('/processCourier/:id')
  @HttpCode(HttpStatus.OK)
  async processCourierV2(
    @Param('id') orderId: bigint,
    @GetUser() user: User,
    @Body() dto: CourierProcessDto,
  ) {
    return await this.service.processCourierV2(orderId, user, dto);
  }
}
