import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
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
import { ListFilter } from '@rahino/query-filter';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { CoffeReportService } from './coffe-report.service';

@ApiTags('DiscountCoffe-CoffeReport')
@ApiBearerAuth()
@Controller({
  path: '/api/discountcoffe/admin/coffereports',
  version: ['1'],
})
export class CoffeReportController {
  constructor(private service: CoffeReportService) {}
  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiOperation({ description: 'show all total adminreports' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.coffereports.getall',
  })
  @Get('/totalReserves')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async totalReserves(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.totalReserves(user, filter);
  }
}
