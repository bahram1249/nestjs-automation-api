import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { Role } from '@rahino/database/models/core/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly repository: typeof User,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
  ) {}

  async edit(userId: number) {
    const user = await this.repository.findOne({
      include: [
        {
          model: Role,
          as: 'roles',
          required: false,
        },
      ],
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException();

    const roleIds = user.roles.map((role) => role.id);
    const roles = await this.roleRepository.findAll();

    return {
      title: 'ویرایش ' + user.firstname,
      layout: false,
      user: user.toJSON(),
      currentRoleIds: roleIds,
      roles: JSON.parse(JSON.stringify(roles)),
    };
  }

  async create() {
    const roles = await this.roleRepository.findAll();
    return {
      title: 'ایجاد کاربر',
      layout: false,
      roles: JSON.parse(JSON.stringify(roles)),
    };
  }
}
