import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DeliveryOrderService } from './delivery-order.service';
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
import { JwtGuard } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { ListFilter } from '@rahino/query-filter';
import { ApiJsonResponse } from '@rahino/response';
import {
  OrderResponseDto,
  OrderDetailResponseDto,
  AdminOrderUserResponseDto,
  OrderStatusResponseDto,
  OrderShipmentWayResponseDto,
  AdminOrderAddressResponseDto,
  AdminOrderVendorResponseDto,
  AdminOrderProductResponseDto,
  OrderDetailStatusResponseDto,
  DiscountResponseDto,
  ProvinceResponseDto,
  CityResponseDto,
  NeighborhoodResponseDto,
  ColorResponseDto,
  GuaranteeResponseDto,
  GuaranteeMonthResponseDto,
  InventoryResponseDto,
  AttachmentResponseDto,
} from '../dto';

@ApiTags('Courier-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/deliveryOrders',
  version: ['1'],
})
export class DeliveryOrderController {
  constructor(private readonly service: DeliveryOrderService) {}

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
  @ApiJsonResponse({
    type: OrderResponseDto,
    isArray: true,
    extraModels: [
      OrderDetailResponseDto,
      AdminOrderUserResponseDto,
      OrderStatusResponseDto,
      OrderShipmentWayResponseDto,
      AdminOrderAddressResponseDto,
      AdminOrderVendorResponseDto,
      AdminOrderProductResponseDto,
      OrderDetailStatusResponseDto,
      DiscountResponseDto,
      ProvinceResponseDto,
      CityResponseDto,
      NeighborhoodResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      InventoryResponseDto,
      AttachmentResponseDto,
    ],
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
  @ApiJsonResponse({
    type: OrderResponseDto,
    extraModels: [
      OrderDetailResponseDto,
      AdminOrderUserResponseDto,
      OrderStatusResponseDto,
      OrderShipmentWayResponseDto,
      AdminOrderAddressResponseDto,
      AdminOrderVendorResponseDto,
      AdminOrderProductResponseDto,
      OrderDetailStatusResponseDto,
      DiscountResponseDto,
      ProvinceResponseDto,
      CityResponseDto,
      NeighborhoodResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      InventoryResponseDto,
      AttachmentResponseDto,
    ],
  })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @ApiOperation({ description: 'change order to customer' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.deliveryorders.processdeliver',
  })
  @Patch('/processDelivery/:id')
  @ApiJsonResponse({
    type: OrderResponseDto,
    extraModels: [
      OrderDetailResponseDto,
      AdminOrderUserResponseDto,
      OrderStatusResponseDto,
      OrderShipmentWayResponseDto,
      AdminOrderAddressResponseDto,
      AdminOrderVendorResponseDto,
      AdminOrderProductResponseDto,
      OrderDetailStatusResponseDto,
      DiscountResponseDto,
      ProvinceResponseDto,
      CityResponseDto,
      NeighborhoodResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      InventoryResponseDto,
      AttachmentResponseDto,
    ],
  })
  @HttpCode(HttpStatus.OK)
  async processPost(@Param('id') orderId: bigint, @GetUser() user: User) {
    return await this.service.processDelivery(orderId, user);
  }
}
