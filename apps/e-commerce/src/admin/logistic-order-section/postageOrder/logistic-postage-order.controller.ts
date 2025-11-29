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
import { PostProcessDto } from 'apps/e-commerce/src/admin/order-section/postageOrder/dto';
import { LogisticPostageOrderService } from './logistic-postage-order.service';

@ApiTags('Logistic-Postage-Orders')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/admin/logistic/postageOrders',
  version: ['1'],
})
export class LogisticPostageOrderController {
  constructor(private readonly service: LogisticPostageOrderService) {}

  @ApiOperation({ description: 'show all postage orders' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.postageorders.getall' })
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

  @ApiOperation({ description: 'show postage orders by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.admin.postageorders.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: bigint, @GetUser() user: User) {
    return await this.service.findById(entityId, user);
  }

  @ApiOperation({
    description: 'change group to post (id is ECLogisticOrderGrouped.id)',
  })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.postageorders.processpost',
  })
  @Patch('/processPost/:id')
  @HttpCode(HttpStatus.OK)
  async processPost(
    @Param('id') groupId: bigint,
    @GetUser() user: User,
    @Body() dto: PostProcessDto,
  ) {
    return await this.service.processPost(groupId, user, dto);
  }
}
