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
import { GetAdminCourierDto } from './dto';
import { AdminCourierService } from './admin-courier.service';

@ApiTags('Report-AdminCourier')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/adminCouriers',
  version: ['1'],
})
export class AdminCourierController {
  constructor(private service: AdminCourierService) {}

  @ApiOperation({ description: 'show all couriers report admin' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.admincouriers.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetAdminCourierDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetAdminCourierDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show total admin courier report' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.admincouriers.getall',
  })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetAdminCourierDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@Query() filter: GetAdminCourierDto) {
    return await this.service.total(filter);
  }
}
