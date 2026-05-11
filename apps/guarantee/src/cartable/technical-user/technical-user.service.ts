import { BadRequestException, Injectable } from '@nestjs/common';
import { GetTechnicalUserDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSRequest, GSTechnicalPerson } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, where } from 'sequelize';
import { Op } from 'sequelize';
import { LocalizationService } from 'apps/main/src/common/localization';
import { User } from '@rahino/database';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class CartableTechnicalUserService {
  constructor(
    @InjectModel(GSTechnicalPerson)
    private readonly repository: typeof GSTechnicalPerson,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    private readonly localizationService: LocalizationService,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(requestId: bigint, filter: GetTechnicalUserDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: requestId })
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero('GSRequest.isDeleted', 0),
        )
        .build(),
    );

    if (!request) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.guarantee_request_item_not_founded',
        ),
      );
    }

    const query = new QueryOptionsBuilder()
      .include([
        {
          model: User,
          as: 'user',
          required: true,
          attributes: ['id', 'firstname', 'lastname'],
          where: {
            [Op.or]: [
              {
                firstname: {
                  [Op.like]: filter.search,
                },
              },
              {
                lastname: {
                  [Op.like]: filter.search,
                },
              },
            ],
          },
        },
      ])
      .filter({ organizationId: request.organizationId })
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy });

    const count = await this.repository.count(query.build());
    const queryResults = await this.repository.findAll(query.build());
    const mappedItems = queryResults.map((item) => {
      return {
        id: item.user.id,
        fullName: item.user.firstname + ' ' + item.user.lastname,
      };
    });

    return {
      result: mappedItems,
      total: count,
    };
  }
}
