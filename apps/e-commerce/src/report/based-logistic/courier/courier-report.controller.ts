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

import { JwtGuard, GetUser } from '@rahino/auth';
import { GetBasedCourierReportDto } from './dto/get-courier-report.dto';
import { BasedCourierReportService } from './courier-report.service';
import { User } from '@rahino/database';

@ApiTags('Report-BasedCourier')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/based-logistic/couriers',
  version: ['1'],
})
export class BasedCourierReportController {
  constructor(private service: BasedCourierReportService) {}

  @ApiOperation({ description: 'show all couriers report (based-logistic, user)' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.couriers.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetBasedCourierReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetBasedCourierReportDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show total courier report (based-logistic, user)' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.couriers.getall',
  })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetBasedCourierReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@GetUser() user: User, @Query() filter: GetBasedCourierReportDto) {
    return await this.service.total(user, filter);
  }
}
