import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JwtWebGuard } from '@rahino/auth';
import { GetUser } from '@rahino/auth';
import { Menu } from '@rahino/database';
import { AllFactorReportService } from './all-factor-report.service';
import { Request } from 'express';
import { User } from '@rahino/database';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/discountcoffe/admin/allFactorReport',
})
export class AllFactorReportController {
  constructor(private service: AllFactorReportService) {}
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.allfactorreport.showmenu',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('admin/allfactorreport/index')
  async get(
    @GetUser() user: User,
    @GetUser('menus') menus: Menu[],
    @Req() req: Request,
  ) {
    return await this.service.factorReport(req, user, menus);
  }
}
