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
import { JwtWebGuard } from '@rahino/auth';
import { GetUser } from '@rahino/auth';
import { Menu } from '@rahino/database';
import { ReserveService } from './reserve.service';
import { Request } from 'express';
import { OrderDto, ReserveDto } from './dto';
import { User } from '@rahino/database';

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

  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.reservers.getall',
  })
  @Get('/addOrder')
  @HttpCode(HttpStatus.OK)
  @Render('admin/reserve/addOrder')
  async addOrder(
    @Req() req: Request,
    @GetUser() user: User,
    @Query() query: OrderDto,
  ) {
    return await this.service.addOrder(req, user, query);
  }
}
