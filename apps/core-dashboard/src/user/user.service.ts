import { Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { Menu } from '@rahino/database';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { UserDto, UserPasswordDto } from './dto';
import { Response } from 'express';
import * as _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
  ) {}
  async profile(title: string, user: User, menus: Menu[], req: Request) {
    const currentUser = await this.userRepository.findOne(
      new QueryOptionsBuilder().filter({ id: user.id }).build(),
    );
    return {
      title,
      user: currentUser.toJSON(),
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
    };
  }

  async changeProfile(
    title: string,
    user: User,
    menus: Menu[],
    req: Request,
    dto: UserDto,
  ) {
    const currentUser = (
      await this.userRepository.update(_.pick(dto, ['firstname', 'lastname']), {
        where: {
          id: user.id,
        },
        returning: true,
      })
    )[1][0];

    return {
      title,
      user: currentUser.toJSON(),
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
    };
  }

  async changePassword(title: string, user: User, menus: Menu[], req: Request) {
    const error: string = null;
    const success: string = null;
    return {
      title,
      user: user.toJSON(),
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
      error,
      success,
    };
  }

  async postChangePassword(
    title: string,
    user: User,
    menus: Menu[],
    req: Request,
    dto: UserPasswordDto,
  ) {
    let error: string = null;
    let success: string = null;
    let currentUser = await this.userRepository.findOne(
      new QueryOptionsBuilder().filter({ id: user.id }).build(),
    );
    const validPassword = await currentUser.validPasswordAsync(
      dto.currentPassword,
    );
    if (!validPassword) {
      error = 'old password is not true';
    } else if (dto.newPassword != dto.confirmPassword) {
      error = 'confirm password not match';
    } else {
      currentUser.password = dto.newPassword;
      currentUser = await currentUser.save();
      success = 'successfull';
    }

    return {
      title,
      user: user.toJSON(),
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
      error: error,
      success: success,
    };
  }

  async exit(res: Response) {
    res.clearCookie('token');
    res.redirect(302, '/');
  }
}
