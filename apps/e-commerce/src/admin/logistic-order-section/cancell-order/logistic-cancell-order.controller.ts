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
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard, GetUser } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { User } from '@rahino/database';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { GetTotalOrderFilterDto } from 'apps/e-commerce/src/admin/order-section/cancell-order/dto/get-total-order.dto';
import { LogisticCancellOrderService } from './logistic-cancell-order.service';

@ApiTags('Logistic-Cancell-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/logistic/cancellOrders',
  version: ['1'],
})
export class LogisticCancellOrderController {
  constructor(private readonly service: LogisticCancellOrderService) {}

  @ApiOperation({ description: 'show all cancell orders' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.cancellorders.getall' })
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

  @ApiOperation({ description: 'show cancell orders by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.cancellorders.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }
}
