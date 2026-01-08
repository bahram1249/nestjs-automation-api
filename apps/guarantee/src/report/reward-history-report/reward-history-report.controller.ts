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
import { RewardHistoryReportService } from './reward-history-report.service';
import { GetRewardHistoryReportDto } from './dto/reward-history-report.dto';

@ApiTags('GSReport-RewardHistoryReport')
@UseGuards(JwtGuard, PermissionGuard)
@ApiBearerAuth()
@Controller({
  path: '/api/guarantee/report/rewardHistories',
  version: ['1'],
})
export class RewardHistoryReportController {
  constructor(private service: RewardHistoryReportService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show all reward history reports' })
  @CheckPermission({
    permissionSymbol: 'gs.report.rewardhistories.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetRewardHistoryReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetRewardHistoryReportDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'export reward history reports to Excel' })
  @CheckPermission({
    permissionSymbol: 'gs.report.rewardhistories.getall',
  })
  @Get('/export')
  @ApiQuery({
    name: 'filter',
    type: GetRewardHistoryReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async export(
    @Query() filter: GetRewardHistoryReportDto,
    @Res() res: Response,
  ) {
    const buffer = await this.service.exportExcel(filter);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reward-history-reports.xlsx"',
    );
    res.send(buffer);
  }
}
