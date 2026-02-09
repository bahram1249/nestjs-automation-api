import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PendingOrderService } from './pending-order.service';
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
import { GetOrderDto } from './dto';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
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

@ApiTags('Admin-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/pendingOrders',
  version: ['1'],
})
export class PendingOrderController {
  constructor(private readonly service: PendingOrderService) {}

  @ApiOperation({ description: 'show all pending orders' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.pendingorders.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetOrderDto,
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
  async findAll(@GetUser() user: User, @Query() filter: GetOrderDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show pending orders by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.pendingorders.getone' })
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
  @ApiJsonResponse({
    type: OrderDetailResponseDto,
    extraModels: [
      AdminOrderVendorResponseDto,
      AdminOrderProductResponseDto,
      OrderDetailStatusResponseDto,
      DiscountResponseDto,
      ColorResponseDto,
      GuaranteeResponseDto,
      GuaranteeMonthResponseDto,
      InventoryResponseDto,
      AttachmentResponseDto,
    ],
  })
  @HttpCode(HttpStatus.OK)
  async processDetail(@Param('id') detailId: bigint, @GetUser() user: User) {
    return await this.service.processDetail(detailId, user);
  }
}
