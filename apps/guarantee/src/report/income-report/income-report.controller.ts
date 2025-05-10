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
import { IncomeReportService } from './income-report.service';
import { GetIncomeReportDto } from './dto';

@ApiTags('GSReport-IncomeReport')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/guarantee/report/incomeReports',
  version: ['1'],
})
export class IncomeReportController {
  constructor(private service: IncomeReportService) {}

  @ApiOperation({ description: 'show all income reports' })
  @CheckPermission({
    permissionSymbol: 'gs.report.incomereports.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetIncomeReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetIncomeReportDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show total income reports' })
  @CheckPermission({
    permissionSymbol: 'gs.report.incomereports.getall',
  })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetIncomeReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@Query() filter: GetIncomeReportDto) {
    return await this.service.total(filter);
  }
}
