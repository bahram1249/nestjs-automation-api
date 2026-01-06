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
import { DiscountCodeUsageReportService } from './discount-code-usage-report.service';
import { GetDiscountCodeUsageReportDto } from './dto/discount-code-usage-report.dto';

@ApiTags('GSReport-DiscountCodeUsageReport')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@Controller({
  path: '/api/guarantee/report/discountCodeUsages',
  version: ['1'],
})
export class DiscountCodeUsageReportController {
  constructor(private service: DiscountCodeUsageReportService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show all discount code usage reports' })
  @CheckPermission({
    permissionSymbol: 'gs.report.discountcodeusages.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetDiscountCodeUsageReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetDiscountCodeUsageReportDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'export discount code usage reports to Excel' })
  @CheckPermission({
    permissionSymbol: 'gs.report.discountcodeusages.getall',
  })
  @Get('/export')
  @ApiQuery({
    name: 'filter',
    type: GetDiscountCodeUsageReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async export(
    @Query() filter: GetDiscountCodeUsageReportDto,
    @Res() res: Response,
  ) {
    const buffer = await this.service.exportExcel(filter);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="discount-code-usage-reports.xlsx"',
    );
    res.send(buffer);
  }
}
