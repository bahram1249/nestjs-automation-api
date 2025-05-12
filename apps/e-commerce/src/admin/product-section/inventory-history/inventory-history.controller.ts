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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { InventoryHistoryService } from './inventory-history.service';
import { ListFilter } from '@rahino/query-filter';

@ApiTags('Admin-InventoryHistories')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  version: ['1'],
  path: '/api/ecommerce/admin/inventoryHistories',
})
export class InventoryHistoryController {
  constructor(private readonly service: InventoryHistoryService) {}

  @ApiOperation({ description: 'show all inventory histories' })
  @Get('/:inventoryId')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @CheckPermission({
    permissionSymbol: 'ecommerce.admin.inventoryhistories.getall',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filter: ListFilter,
    @Param('inventoryId') inventoryId: bigint,
    @GetUser() user: User,
  ) {
    return await this.service.findAll(user, inventoryId, filter);
  }
}
