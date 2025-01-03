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
import { GetCourierReportDto } from './dto';
import { CourierReportService } from './courier-report.service';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('Report-Courier')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/couriers',
  version: ['1'],
})
export class CourierReportController {
  constructor(private service: CourierReportService) {}

  @ApiOperation({ description: 'show all couriers report' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.couriers.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetCourierReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetCourierReportDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show total courier report' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.couriers.getall',
  })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetCourierReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@GetUser() user: User, @Query() filter: GetCourierReportDto) {
    return await this.service.total(user, filter);
  }
}
