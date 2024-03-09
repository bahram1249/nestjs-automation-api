import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JwtWebGuard } from '@rahino/auth/guard';
import { GetUser } from '@rahino/auth/decorator';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { ReserveService } from './reserve.service';
import { Request } from 'express';
import { ReserveDto } from './dto';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/discountcoffe/admin/reservers',
})
export class ReserveController {
  constructor(private service: ReserveService) {}
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.reservers.getall',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('admin/reserve/index')
  async get(
    @GetUser('menus') menus: Menu[],
    @Req() req: Request,
    @Query() query: ReserveDto,
  ) {
    return {
      title: 'منو کافه و رستوران',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
      reserveId: query.reserveId,
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
