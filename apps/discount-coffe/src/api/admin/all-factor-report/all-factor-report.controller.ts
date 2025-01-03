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
import { AllFactorReportService } from './all-factor-report.service';
import { AllFactorReportDto } from './dto';

@ApiTags('DiscountCoffe-ALL-Factor-report')
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/discountcoffe/admin/allFactorReports',
  version: ['1'],
})
export class AllFactorReportController {
  constructor(private service: AllFactorReportService) {}

  @ApiOperation({ description: 'show all total reserves' })
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.allfactorreport.showmenu',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: AllFactorReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: AllFactorReportDto) {
    return await this.service.findAll(filter);
  }
}
