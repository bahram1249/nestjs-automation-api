import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
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
import { Response } from 'express';

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

  @ApiOperation({ description: 'export income reports to Excel' })
  @CheckPermission({
    permissionSymbol: 'gs.report.incomereports.getall',
  })
  @Get('/export')
  @ApiQuery({
    name: 'filter',
    type: GetIncomeReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async export(@Query() filter: GetIncomeReportDto, @Res() res: Response) {
    const buffer = await this.service.exportExcel(filter);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="income-reports.xlsx"',
    );
    res.send(buffer);
  }
}
