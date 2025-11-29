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
import { ActivityReportService } from './activity-report.service';
import { GetActivityReportDto } from './dto/get-activity-report.dto';

@ApiTags('GSReport-ActivityReport')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/guarantee/report/activityReports',
  version: ['1'],
})
export class ActivityReportController {
  constructor(private service: ActivityReportService) {}

  @ApiOperation({ description: 'show all activity reports' })
  @CheckPermission({
    permissionSymbol: 'gs.report.activityreports.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetActivityReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetActivityReportDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'export activity reports to Excel' })
  @CheckPermission({
    permissionSymbol: 'gs.report.activityreports.getall',
  })
  @Get('/export')
  @ApiQuery({
    name: 'filter',
    type: GetActivityReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async export(@Query() filter: GetActivityReportDto, @Res() res: Response) {
    const buffer = await this.service.exportExcel(filter);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="activity-reports.xlsx"',
    );
    res.send(buffer);
  }
}
