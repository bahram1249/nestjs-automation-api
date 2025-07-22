import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';

import { User } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ProfileDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class GSProfileService {
  constructor(
    private readonly localizationService: LocalizationService,
    @InjectModel(User) private readonly repository: typeof User,
  ) {}

  async updateUserInfo(user: User, dto: ProfileDto) {
    await this.repository.update(
      {
        firstname: dto.firstname,
        lastname: dto.lastname,
        nationalCode: dto.nationalCode,
      },
      {
        where: {
          id: user.id,
        },
      },
    );
    return {
      result: {
        message: this.localizationService.translate('core.success'),
      },
    };
  }

  async get(user: User) {
    const result = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'firstname', 'lastname', 'nationalCode'])
        .filter({ id: user.id })
        .build(),
    );

    return {
      result: result,
    };
  }
}
