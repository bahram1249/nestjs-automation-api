import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@rahino/database';
import { User } from '@rahino/database';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { ListFilter } from '@rahino/query-filter/types';
import { Op } from 'sequelize';
import { UserDto } from './dto';
// import { InjectMapper } from '@automapper/nestjs';
// import { Mapper } from '@automapper/core';
import { UserRole } from '@rahino/database';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole, //@InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async findAll(filter: ListFilter) {
    let options = QueryFilter.init();

    // include
    options.include = [
      {
        model: Role,
      },
    ];

    // search
    options.where = {
      username: {
        [Op.like]: filter.search,
      },
    };

    const count = await this.userRepository.count(options);
    options.attributes = [
      'id',
      'firstname',
      'lastname',
      'username',
      'email',
      'phoneNumber',
      'mustChangePassword',
      'lastPasswordChangeDate',
      'profilePhotoAttachmentId',
      'static_id',
      'birthDate',
      'createdAt',
      'updatedAt',
    ];
    options = QueryFilter.toFindAndCountOptions(options, filter);
    return {
      result: await this.userRepository.findAll(options),
      total: count,
    };
  }

  async findById(id: bigint) {
    return {
      result: await this.userRepository.findOne({
        include: [
          {
            model: Role,
          },
        ],
        attributes: [
          'id',
          'firstname',
          'lastname',
          'username',
          'email',
          'phoneNumber',
          'mustChangePassword',
          'lastPasswordChangeDate',
          'profilePhotoAttachmentId',
          'static_id',
          'birthDate',
          'createdAt',
          'updatedAt',
        ],
        where: {
          id,
        },
      }),
    };
  }

  async create(dto: UserDto) {
    let user = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });
    if (user) throw new ForbiddenException('Credentials taken');
    if (dto.email) {
      user = await this.userRepository.findOne({
        where: {
          email: dto.email,
        },
      });
      if (user) throw new ForbiddenException('Credentials taken');
    }

    if (dto.roles && (dto.ignoreRole == null || dto.ignoreRole == false)) {
      for (let index = 0; index < dto.roles.length; index++) {
        const roleId = dto.roles[index];
        const role = await this.roleRepository.findOne({
          where: {
            id: roleId,
          },
        });
        if (!role)
          throw new BadRequestException(`the role id: ${roleId} is not found!`);
      }
    }

    const userObj = JSON.parse(JSON.stringify(dto));
    userObj.password = dto.username;
    user = await this.userRepository.create(userObj);

    if (dto.roles && (dto.ignoreRole == null || dto.ignoreRole == false)) {
      for (let index = 0; index < dto.roles.length; index++) {
        const roleId = dto.roles[index];
        const userRole = await this.userRoleRepository.create({
          userId: user.id,
          roleId: roleId,
        });
      }
    }

    user = await this.userRepository.findOne({
      include: [
        {
          model: Role,
        },
      ],
      attributes: [
        'id',
        'firstname',
        'lastname',
        'username',
        'email',
        'phoneNumber',
        'mustChangePassword',
        'lastPasswordChangeDate',
        'profilePhotoAttachmentId',
        'static_id',
        'birthDate',
        'createdAt',
        'updatedAt',
      ],
      where: {
        id: user.id,
      },
    });
    return {
      result: user,
    };
  }

  async update(userId: bigint, dto: UserDto) {
    // logic validation
    let user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('Not Found!');
    user = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });
    if (user != null && user.id != userId) {
      throw new BadRequestException('this username was given by another user!');
    }

    if (dto.roles && (dto.ignoreRole == null || dto.ignoreRole == false)) {
      for (let index = 0; index < dto.roles.length; index++) {
        const roleId = dto.roles[index];
        const role = await this.roleRepository.findOne({
          where: {
            id: roleId,
          },
        });
        if (!role)
          throw new BadRequestException(`the role id: ${roleId} is not found!`);
      }
    }

    await this.userRepository.update(JSON.parse(JSON.stringify(dto)), {
      where: {
        id: userId,
      },
    });

    if (dto.ignoreRole == null || dto.ignoreRole == false) {
      // remove all roles of this user
      await this.userRoleRepository.destroy({
        where: {
          userId: userId,
        },
      });

      if (dto.roles) {
        for (let index = 0; index < dto.roles.length; index++) {
          const roleId = dto.roles[index];
          const userRole = await this.userRoleRepository.create({
            userId: user.id,
            roleId: roleId,
          });
        }
      }
    }

    user = await this.userRepository.findOne({
      include: [
        {
          model: Role,
        },
      ],
      attributes: [
        'id',
        'firstname',
        'lastname',
        'username',
        'email',
        'phoneNumber',
        'mustChangePassword',
        'lastPasswordChangeDate',
        'profilePhotoAttachmentId',
        'static_id',
        'createdAt',
        'updatedAt',
      ],
      where: {
        id: userId,
      },
    });
    return {
      result: user,
    };
  }
}
