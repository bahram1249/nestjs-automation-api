import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtWebGuard } from '@rahino/auth';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { UserDto } from './dto';

@UseGuards(JwtWebGuard)
@Controller({
  path: '/user',
})
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/profile')
  @Render('user-discount/profile')
  async index(@GetUser() user: User, @Req() req: Request) {
    return await this.service.profile(user, req);
  }

  @Post('/profile')
  @Render('user-discount/profile')
  async updateProfile(
    @GetUser() user: User,
    @Req() req: Request,
    @Body() dto: UserDto,
  ) {
    return await this.service.updateProfile(user, req, dto);
  }

  @Get('/reserves')
  @Render('user-discount/reserves')
  async reserves(@GetUser() user: User, @Req() req: Request) {
    return await this.service.reserves(user, req);
  }

  @Get('/reserves/page/:id')
  @Render('user-discount/reserves')
  async reservesPaging(
    @Param('id') page: number,
    @GetUser() user: User,
    @Req() req: Request,
  ) {
    return await this.service.reserves(user, req, page);
  }

  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    return await this.service.logout(req, res);
  }
}
