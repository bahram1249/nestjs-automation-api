import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtWebGuard } from '@rahino/auth';
import { GetUser } from '@rahino/auth';
import { Menu } from '@rahino/database';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from '@rahino/database';
import { UserDto, UserPasswordDto } from './dto';

@UseGuards(JwtWebGuard)
@Controller({
  path: '/core/user',
})
export class UserController {
  constructor(private service: UserService) {}
  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @Render('user/profile')
  async profile(
    @GetUser() user: User,
    @GetUser('menus') menus: Menu[],
    @Req() req: Request,
  ) {
    const title = 'پروفایل';
    return await this.service.profile(title, user, menus, req);
  }

  @Post('/profile')
  @HttpCode(HttpStatus.OK)
  @Render('user/profile')
  async changeProfile(
    @GetUser() user: User,
    @GetUser('menus') menus: Menu[],
    @Req() req: Request,
    @Body() dto: UserDto,
  ) {
    const title = 'پروفایل';
    return await this.service.changeProfile(title, user, menus, req, dto);
  }

  @Get('/changepassword')
  @HttpCode(HttpStatus.OK)
  @Render('user/changepassword')
  async changePassword(
    @GetUser() user: User,
    @GetUser('menus') menus: Menu[],
    @Req() req: Request,
  ) {
    const title = 'تغییر کلمه عبور';
    return await this.service.changePassword(title, user, menus, req);
  }

  @Post('/changepassword')
  @HttpCode(HttpStatus.OK)
  @Render('user/changepassword')
  async postChangePassword(
    @GetUser() user: User,
    @GetUser('menus') menus: Menu[],
    @Req() req: Request,
    @Body() dto: UserPasswordDto,
  ) {
    const title = 'تغییر کلمه عبور';
    return await this.service.postChangePassword(title, user, menus, req, dto);
  }

  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  async exit(@Res() res) {
    return await this.service.exit(res);
  }
}
