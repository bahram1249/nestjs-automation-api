import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { JwtGuard } from '@rahino/auth';
import { BasedAdminCourierService } from './admin-courier.service';
import { GetAdminCourierDto } from '../../admin-courier/dto';

@ApiTags('Report-AdminCouriers-BasedLogistic')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/basedLogistic/adminCouriers',
  version: ['1'],
})
export class BasedAdminCourierController {
  constructor(private readonly service: BasedAdminCourierService) {}

  @ApiOperation({
    description: 'show all couriers report admin (based-logistic)',
  })
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

  @ApiOperation({
    description: 'show total admin courier report (based-logistic)',
  })
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
