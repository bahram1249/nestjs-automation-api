import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@rahino/database/models/core/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { PermissionMenu } from '@rahino/database/models/core/permission-menu.entity';
import { Op, Sequelize } from 'sequelize';
import { Role } from '@rahino/database/models/core/role.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(Menu)
    private readonly menuRepository: typeof Menu,
    @InjectModel(RolePermission)
    private readonly rolePermissionRepository: typeof RolePermission,
    @InjectModel(PermissionMenu)
    private readonly permissionMenuRepository: typeof PermissionMenu,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    let user: any = await this.cacheManager.get(`userid:${payload.sub}`);
    if (!user) {
      user = await this.userRepository.findOne({
        attributes: [
          'id',
          'firstname',
          'lastname',
          'email',
          'username',
          'phoneNumber',
          'mustChangePassword',
          'lastPasswordChangeDate',
          'static_id',
          'profilePhotoAttachmentId',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: Role,
            as: 'roles',
          },
        ],
        where: {
          id: payload.sub,
        },
      });
      let menus: any = null;
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
      user.menus = menus;
      await this.cacheManager.set(`userid:${payload.sub}`, user);
    }
    return user;
  }
}
