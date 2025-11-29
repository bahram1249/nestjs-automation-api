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
import { SupplierReportService } from './supplier-report.service';
import { GetSupplierReportDto } from './dto';

@ApiTags('GSReport-SupplierReport')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/guarantee/report/supplierReports',
  version: ['1'],
})
export class SupplierReportController {
  constructor(private service: SupplierReportService) {}

  @ApiOperation({ description: 'show all supplier reports' })
  @CheckPermission({
    permissionSymbol: 'gs.report.supplierreports.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetSupplierReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetSupplierReportDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'export supplier reports to Excel' })
  @CheckPermission({
    permissionSymbol: 'gs.report.supplierreports.getall',
  })
  @Get('/export')
  @ApiQuery({
    name: 'filter',
    type: GetSupplierReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async export(@Query() filter: GetSupplierReportDto, @Res() res: Response) {
    const buffer = await this.service.exportExcel(filter);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="supplier-reports.xlsx"',
    );
    res.send(buffer);
  }
}
