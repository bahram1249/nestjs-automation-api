import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PostageOrderService } from './postage-order.service';
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
import { JwtGuard } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { ListFilter } from '@rahino/query-filter';
import { PostProcessDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import {
  OrderResponseDto,
  OrderDetailResponseDto,
  UserResponseDto,
  OrderStatusResponseDto,
  OrderShipmentWayResponseDto,
  AddressResponseDto,
  VendorResponseDto,
  ProductResponseDto,
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

@ApiTags('Postage-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/postageOrders',
  version: ['1'],
})
export class PostageOrderController {
  constructor(private readonly service: PostageOrderService) {}

  @ApiOperation({ description: 'show all postage orders' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.postageorders.getall' })
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
      UserResponseDto,
      OrderStatusResponseDto,
      OrderShipmentWayResponseDto,
      AddressResponseDto,
      VendorResponseDto,
      ProductResponseDto,
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

  @ApiOperation({ description: 'show postage orders by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.postageorders.getone' })
  @Get('/:id')
  @ApiJsonResponse({
    type: OrderResponseDto,
    extraModels: [
      OrderDetailResponseDto,
      UserResponseDto,
      OrderStatusResponseDto,
      OrderShipmentWayResponseDto,
      AddressResponseDto,
      VendorResponseDto,
      ProductResponseDto,
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

  @ApiOperation({ description: 'change order to post' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.postageorders.processpost',
  })
  @Patch('/processPost/:id')
  @ApiJsonResponse({
    type: OrderResponseDto,
    extraModels: [
      UserResponseDto,
      OrderStatusResponseDto,
      OrderShipmentWayResponseDto,
      AddressResponseDto,
    ],
  })
  @HttpCode(HttpStatus.OK)
  async processPost(
    @Param('id') orderId: bigint,
    @GetUser() user: User,
    @Body() dto: PostProcessDto,
  ) {
    return await this.service.processPost(orderId, user, dto);
  }
}
