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
import { UserActionReportService } from './user-action-report.service';
import { GetUserActionReportDto } from './dto/user-action-report.dto';

@ApiTags('GSReport-UserActionReport')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/guarantee/report/userActionReports',
  version: ['1'],
})
export class UserActionReportController {
  constructor(private service: UserActionReportService) {}

  @ApiOperation({ description: 'show all user action reports' })
  @CheckPermission({
    permissionSymbol: 'gs.report.useractionreports.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetUserActionReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetUserActionReportDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'export user action reports to Excel' })
  @CheckPermission({
    permissionSymbol: 'gs.report.useractionreports.getall',
  })
  @Get('/export')
  @ApiQuery({
    name: 'filter',
    type: GetUserActionReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async export(@Query() filter: GetUserActionReportDto, @Res() res: Response) {
    const buffer = await this.service.exportExcel(filter);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="user-action-reports.xlsx"',
    );
    res.send(buffer);
  }
}
