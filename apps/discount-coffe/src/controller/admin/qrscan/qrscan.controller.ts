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
import { QrScanService } from './qrscan.service';
import { Request } from 'express';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/discountcoffe/admin/qrscan',
})
export class QrScanController {
  constructor(private service: QrScanService) {}
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.qrscan.showmenu',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('admin/qrscan/index')
  async get(@GetUser('menus') menus: Menu[], @Req() req: Request) {
    return {
      title: 'اسکن بارکد',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
    };
  }
}
