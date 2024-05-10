import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@rahino/database/models/core/user.entity';
import { CourierDto, GetCourierDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { ECCourier } from '@rahino/database/models/ecommerce-eav/ec-courier.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { UserCourierDto } from './dto/user-courier-dto';
import * as _ from 'lodash';
import { UserRoleService } from '@rahino/core/admin/user-role/user-role.service';
import { Role } from '@rahino/database/models/core/role.entity';

@Injectable()
export class CourierService {
  private readonly courierRoleStaticId = 3;
  constructor(
    @InjectModel(ECCourier)
    private readonly repository: typeof ECCourier,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly userRoleService: UserRoleService,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(user: User, filter: GetCourierDto) {
    let queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECCourier.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    const count = await this.repository.count(queryBuilder.build());
    queryBuilder = queryBuilder
      .attributes(['id', 'userId', 'createdAt', 'updatedAt'])
      .include([
        {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'firstname',
            'lastname',
            'username',
            'phoneNumber',
          ],
        },
      ])
      .offset(filter.offset, filter.ignorePaging)
      .limit(filter.limit, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    return {
      result: await this.repository.findAll(queryBuilder.build()),
      total: count,
    };
  }

  async findById(entityId: number, user: User) {
    let queryBuilder = new QueryOptionsBuilder()
      .attributes(['id', 'userId', 'createdAt', 'updatedAt'])
      .include([
        {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'firstname',
            'lastname',
            'username',
            'phoneNumber',
          ],
        },
      ])
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECCourier.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ id: entityId });
    const item = await this.repository.findOne(queryBuilder.build());
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return {
      result: item,
    };
  }

  async create(user: User, dto: CourierDto) {
    let findUser = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ phoneNumber: dto.phoneNumber })
        .build(),
    );
    if (findUser) {
      const queryBuilder = new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECCourier.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ userId: findUser.id });
      const item = await this.repository.findOne(queryBuilder.build());
      if (item) {
        throw new BadRequestException(
          this.i18n.t('ecommerce.user_exists_before', {
            lang: I18nContext.current().lang,
          }),
        );
      }
    } else {
      const mappedItem = this.mapper.map(dto, UserCourierDto, User);
      const insertedItem = _.omit(mappedItem.toJSON(), ['id']);
      insertedItem.username = dto.phoneNumber;
      findUser = await this.userRepository.create(insertedItem);
    }
    const role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: this.courierRoleStaticId })
        .build(),
    );
    if (!role) {
      throw new BadRequestException(
        this.i18n.t('core.not_found_role', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    await this.userRoleService.insertRoleToUser(role, findUser);
    const item = await this.repository.create({ userId: findUser.id });

    return {
      result: item,
    };
  }

  async deleteById(entityId: number) {
    let queryBuilder = new QueryOptionsBuilder()
      .attributes(['id', 'userId', 'createdAt', 'updatedAt'])
      .include([{ model: User, as: 'user' }])
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECCourier.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ id: entityId });
    let item = await this.repository.findOne(queryBuilder.build());
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const user = await this.userRepository.findOne(
      new QueryOptionsBuilder().filter({ id: item.userId }).build(),
    );

    const role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: this.courierRoleStaticId })
        .build(),
    );
    if (!role) {
      throw new BadRequestException(
        this.i18n.t('core.not_found_role', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    await this.userRoleService.removeRoleFromUser(role, user);

    item = await item.save();

    return {
      result: item,
    };
  }
}
