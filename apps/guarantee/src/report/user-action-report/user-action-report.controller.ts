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
}
