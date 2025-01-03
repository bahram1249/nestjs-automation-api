import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JwtWebGuard } from '@rahino/auth';
import { GetUser } from '@rahino/auth';
import { Menu } from '@rahino/database';
import { TotalReserveService } from './total-reserve.service';
import { Request } from 'express';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/discountcoffe/admin/totalreserves',
})
export class TotalReserveController {
  constructor(private service: TotalReserveService) {}
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.totalreserves.getall',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('admin/totalreserves/index')
  async get(@GetUser('menus') menus: Menu[], @Req() req: Request) {
    return {
      title: 'منو کافه و رستوران',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
    };
  }

  // @CheckPermission({
  //   permissionSymbol: 'discountcoffe.admin.totalreserves.update',
  // })
  // @Get('/:id')
  // @HttpCode(HttpStatus.OK)
  // @Render('admin/totalreserves/edit')
  // async edit(@Param('id') buffetMenuId: bigint) {
  //   return await this.service.edit(buffetMenuId);
  // }
}
