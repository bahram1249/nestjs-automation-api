import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { loginDto } from './dto';
import { Request, Response } from 'express';
import { AuthService } from '@rahino/core/auth/auth.service';
import { Role } from '@rahino/database';
import { PermissionGroup } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { PermissionMenu } from '@rahino/database';
import { Menu } from '@rahino/database';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User)
    private readonly repository: typeof User,
    @InjectModel(RolePermission)
    private readonly rolePermissionRepository: typeof RolePermission,
    @InjectModel(PermissionMenu)
    private readonly permissionMenuRepository: typeof PermissionMenu,
    @InjectModel(Menu)
    private readonly menuRepository: typeof Menu,
    private authService: AuthService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  get() {
    const logoPath = this.config.get<string>('LOGO_PATH');
    return { title: 'صفحه ورود', layout: false, logo: logoPath };
  }
  async login(req: Request, res: Response, dto: loginDto) {
    const user = await this.repository.findOne({
      where: {
        username: dto.username,
      },
      include: [
        {
          model: Role,
          as: 'roles',
        },
      ],
    });
    if (!user) {
      return res.render('login/index', {
        layout: false,
        errorMessage: 'کاربری یافت نشد',
      });
    }

    const validPassword = await user.validPasswordAsync(dto.password);
    if (!validPassword) {
      return res.render('login/index', {
        layout: false,
        errorMessage: 'کاربری یافت نشد',
      });
    }
    const access = await this.authService.signToken(user);
    const oneMonth = 31 * 24 * 3600 * 1000;
    const options: any = {};

    let menus: Menu[] = [];
    const roleIds: number[] = user.roles.map((role) => role.id);
    const rolePermissions = await this.rolePermissionRepository.findAll({
      where: {
        roleId: {
          [Op.in]: roleIds,
        },
      },
    });
    const permissionIds = rolePermissions.map(
      (rolePermission) => rolePermission.permissionId,
    );
    const permissionMenus = await this.permissionMenuRepository.findAll({
      where: {
        permissionId: {
          [Op.in]: permissionIds,
        },
      },
    });
    const menuIds = permissionMenus.map(
      (permissionMenu) => permissionMenu.menuId,
    );
    menus = await this.menuRepository.findAll({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.in]: menuIds,
            },
          },
          {
            parentMenuId: {
              [Op.is]: null,
            },
          },
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('subMenus.visibility'), 1),
            {
              [Op.eq]: 1,
            },
          ),
        ],
      },
      include: [
        {
          model: Menu,
          as: 'subMenus',
          required: false,
          where: {
            id: {
              [Op.in]: menuIds,
            },
          },
        },
      ],
    });

    let url = '/core/admin/roles';
    if (menus.length > 0 && menus[0].subMenus.length > 0) {
      url = menus[0].subMenus[0].url;
    }

    if (req.body.isRemember) options.expires = new Date(Date.now() + oneMonth);
    res.cookie('token', access.access_token, options);
    return res.redirect(302, url);
  }
}
