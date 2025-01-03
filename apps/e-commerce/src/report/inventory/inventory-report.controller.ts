import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth';
import { InventoryReportService } from './inventory-report.service';
import { GetInventoryDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('Report-Inventory')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/inventories',
  version: ['1'],
})
export class InventoryReportController {
  constructor(private service: InventoryReportService) {}

  @ApiOperation({ description: 'show all inventories report admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.inventories.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetInventoryDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetInventoryDto) {
    return await this.service.findAll(user, filter);
  }
}
