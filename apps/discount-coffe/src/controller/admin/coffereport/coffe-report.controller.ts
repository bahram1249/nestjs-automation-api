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
import { JwtWebGuard } from '@rahino/auth/guard';
import { GetUser } from '@rahino/auth/decorator';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { CoffeReportService } from './coffe-report.service';
import { Request } from 'express';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/discountcoffe/admin/coffereports',
})
export class CoffeReportController {
  constructor(private service: CoffeReportService) {}
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.coffereports.getall',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('admin/coffereport/index')
  async get(@GetUser('menus') menus: Menu[], @Req() req: Request) {
    return {
      title: 'گزارش های کافه',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
    };
  }
}
