import { BadRequestException, Injectable } from '@nestjs/common';
import { GetHistoryDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNNodeCommand,
  BPMNOrganization,
  BPMNRequestHistory,
  GSRequest,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';
import { HistoryMapper } from './history.mapper';
import { Role, User } from '@rahino/database';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(BPMNRequestHistory)
    private readonly repository: typeof BPMNRequestHistory,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    private readonly localizationService: LocalizationService,
    private readonly historyMapper: HistoryMapper,
  ) {}

  async findAll(requestId: bigint, filter: GetHistoryDto) {
    // find request
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()

        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSRequest.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: requestId })
        .build(),
    );

    // throw error if is not founded
    if (!request) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.guarantee_request_item_not_founded',
        ),
      );
    }

    let query = new QueryOptionsBuilder().filter({
      requestId: requestId,
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'nodeId',
        'nodeCommandId',
        'fromUserId',
        'fromOrganizationId',
        'fromRoleId',
        'toUserId',
        'toOrganizationId',
        'toRoleId',
        'description',
        'executeBundle',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'name'],
          model: BPMNNodeCommand,
          as: 'nodeCommand',
          required: true,
        },
        {
          attributes: ['id', 'name'],
          model: BPMNActivity,
          as: 'fromActivity',
          required: true,
        },
        {
          attributes: ['id', 'name'],
          model: BPMNActivity,
          as: 'toActivity',
          required: true,
        },
        {
          attributes: ['id', 'firstname', 'lastname'],
          model: User,
          as: 'fromUser',
          required: false,
        },
        {
          attributes: ['id', 'firstname', 'lastname'],
          model: User,
          as: 'toUser',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: BPMNOrganization,
          as: 'fromOrganization',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: BPMNOrganization,
          as: 'toOrganization',
          required: false,
        },
        {
          attributes: ['id', 'roleName'],
          model: Role,
          as: 'fromRole',
          required: false,
        },
        {
          attributes: ['id', 'roleName'],
          model: Role,
          as: 'toRole',
          required: false,
        },
      ])
      .filter({ requestId: requestId })
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());
    const mappedItems = await this.historyMapper.mapItems(results);

    return {
      result: mappedItems,
      total: count,
    };
  }
}
