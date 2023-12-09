import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { loginDto } from './dto';
import { Request, Response } from 'express';
import { AuthService } from '@rahino/core/auth/auth.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User)
    private readonly repository: typeof User,
    private authService: AuthService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(req: Request, res: Response, dto: loginDto) {
    const user = await this.repository.findOne({
      where: {
        username: dto.username,
      },
    });
    if (!user) return { errorMessage: 'کاربری یافت نشد', layout: false };
    const validPassword = await user.validPasswordAsync(dto.password);
    if (!validPassword) {
      return { errorMessage: 'کاربری یافت نشد', layout: false };
    }
    const access = await this.authService.signToken(user);
    const oneMonth = 31 * 24 * 3600 * 1000;
    const options: any = {};
    if (req.body.isRemember) options.expires = new Date(Date.now() + oneMonth);
    res.cookie('token', access.access_token, options);
    res.redirect('/core/admin/roles');
  }
}
