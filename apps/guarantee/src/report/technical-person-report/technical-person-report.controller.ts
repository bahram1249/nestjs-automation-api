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
import { TechnicalPersonReportService } from './technical-person-report.service';
import { GetTechnicalPersonReportDto } from './dto';

@ApiTags('GSReport-TechnicalPersonReport')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/guarantee/report/technicalPersonReports',
  version: ['1'],
})
export class TechnicalPersonReportController {
  constructor(private service: TechnicalPersonReportService) {}

  @ApiOperation({ description: 'show all technical person reports' })
  @CheckPermission({
    permissionSymbol: 'gs.report.technicalpersonreports.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetTechnicalPersonReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetTechnicalPersonReportDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'export technical person reports to Excel' })
  @CheckPermission({
    permissionSymbol: 'gs.report.technicalpersonreports.getall',
  })
  @Get('/export')
  @ApiQuery({
    name: 'filter',
    type: GetTechnicalPersonReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async export(
    @Query() filter: GetTechnicalPersonReportDto,
    @Res() res: Response,
  ) {
    const buffer = await this.service.exportExcel(filter);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="technical-person-reports.xlsx"',
    );
    res.send(buffer);
  }
}
