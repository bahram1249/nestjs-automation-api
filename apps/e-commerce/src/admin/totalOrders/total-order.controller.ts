import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TotalOrderService } from './total-order.service';
import {
  Body,
  Controller,
  Delete,
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
import {
  ChangeOrderStatusDto,
  ChangeShipmentWayDto,
  EditReceiptPostDto,
} from './dto';
import { GetTotalOrderFilterDto } from './dto/get-total-order.dto';

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
    type: GetTotalOrderFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @GetUser() user: User,
    @Query() filter: GetTotalOrderFilterDto,
  ) {
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

  @ApiOperation({ description: 'decrease detail order' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.totalorders.decreasedetail',
  })
  @Delete('/decreaseDetail/:id')
  @HttpCode(HttpStatus.OK)
  async decreaseDetail(@Param('id') detailId: bigint, @GetUser() user: User) {
    return await this.service.decreaseDetail(detailId, user);
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

  @ApiOperation({ description: 'change shipment way order by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.totalorders.changeshipmentway',
  })
  @Patch('/changeShipmentWay/:id')
  @HttpCode(HttpStatus.OK)
  async changeShipmentWay(
    @Param('id') id: bigint,
    @GetUser() user: User,
    @Body() dto: ChangeShipmentWayDto,
  ) {
    return await this.service.changeShipmentWay(id, dto);
  }

  @ApiOperation({ description: 'change order status by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.totalorders.changeorderstatus',
  })
  @Patch('/changeOrderStatus/:id')
  @HttpCode(HttpStatus.OK)
  async changeOrderStatus(
    @Param('id') id: bigint,
    @GetUser() user: User,
    @Body() dto: ChangeOrderStatusDto,
  ) {
    return await this.service.changeOrderStatus(id, dto);
  }

  @ApiOperation({ description: 'edit receipt post by given id' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.totalorders.editreceiptpost',
  })
  @Patch('/editReceiptPost/:id')
  @HttpCode(HttpStatus.OK)
  async editReceiptPost(
    @Param('id') id: bigint,
    @GetUser() user: User,
    @Body() dto: EditReceiptPostDto,
  ) {
    return await this.service.editReceiptPost(id, dto);
  }
}
