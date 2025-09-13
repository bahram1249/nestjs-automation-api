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
import { GetBasedAdminCourierDto } from './dto';
import { BasedAdminCourierService } from './admin-courier.service';

@ApiTags('Report-BasedAdminCourier')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/based-logistic/adminCouriers',
  version: ['1'],
})
export class BasedAdminCourierController {
  constructor(private service: BasedAdminCourierService) {}

  @ApiOperation({ description: 'show all couriers report admin (based-logistic)' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.admincouriers.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetBasedAdminCourierDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetBasedAdminCourierDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show total admin courier report (based-logistic)' })
  @CheckPermission({
    permissionSymbol: 'ecommerce.report.admincouriers.getall',
  })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetBasedAdminCourierDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@Query() filter: GetBasedAdminCourierDto) {
    return await this.service.total(filter);
  }
}
