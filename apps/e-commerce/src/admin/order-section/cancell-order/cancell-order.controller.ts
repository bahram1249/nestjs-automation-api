import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CancellOrderService } from './cancell-order.service';
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
import { JwtGuard } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { GetTotalOrderFilterDto } from './dto/get-total-order.dto';
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

@ApiTags('Cancell-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/cancellOrders',
  version: ['1'],
})
export class CancellOrderController {
  constructor(private readonly service: CancellOrderService) {}

  @ApiOperation({ description: 'show all cancell orders' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.cancellorders.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetTotalOrderFilterDto,
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
  async findAll(
    @GetUser() user: User,
    @Query() filter: GetTotalOrderFilterDto,
  ) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show cancell orders by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.cancellorders.getone' })
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
}
