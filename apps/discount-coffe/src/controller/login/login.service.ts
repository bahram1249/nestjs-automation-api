import { BadRequestException, Injectable, Redirect } from '@nestjs/common';
import { CodeDto, LoginDto } from './dto';
import { User } from '@rahino/database/models/core/user.entity';
import { Request, Response } from 'express';
import { AuthService } from '@rahino/core/auth/auth.service';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
    private authService: AuthService,
  ) {}

  async login(redirectUrl?: string) {
    return {
      title: 'وارد شوید',
      layout: 'discountcoffe',
      redirectUrl: redirectUrl,
    };
  }

  async loginRequest(
    dto: LoginDto,
    req: Request,
    res: Response,
    session: Record<string, any>,
    redirectUrl: string,
  ) {
    let user = await this.userRepository.findOne({
      where: {
        phoneNumber: dto.phoneNumber,
      },
    });
    if (!user) {
      user = await this.userRepository.create({
        username: dto.phoneNumber,
        phoneNumber: dto.phoneNumber,
        password: dto.phoneNumber,
      });
    }
    const rand = '123456';
    req.session.userId = user.id;
    req.session.verifyCode = rand;
    var queryString =
      redirectUrl.length > 0 ? '?redirectUrl=' + redirectUrl : '';
    return res.redirect(302, '/login/code' + queryString);
  }

  async verifyCodeIndex(
    session: Record<string, any>,
    req: Request,
    res: Response,
    redirectUrl?: string,
  ) {
    return {
      title: 'کد تایید را وارد بفرمایید',
      layout: 'discountcoffe',
      redirectUrl: redirectUrl,
    };
  }

  async verifyCode(
    dto: CodeDto,
    session: Record<string, any>,
    req: Request,
    res: Response,
    redirectUrl?: string,
  ) {
    if (dto.code != session.verifyCode) {
      throw new BadRequestException();
    }
    const userId = session.userId;
    if (!userId) throw new BadRequestException();
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new BadRequestException();
    const ru = redirectUrl.length > 0 ? redirectUrl : '/';
    const access = await this.authService.signToken(user);
    const oneMonth = 31 * 24 * 3600 * 1000;
    const options: any = {};
    if (req.body.isRemember) options.expires = new Date(Date.now() + oneMonth);
    res.cookie('token', access.access_token, options);
    return res.redirect(302, ru);
  }
}
