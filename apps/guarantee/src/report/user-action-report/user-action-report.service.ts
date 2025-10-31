import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNRequest,
  BPMNRequestHistory,
  BPMNNode,
  BPMNActivity,
} from '@rahino/localdatabase/models/bpmn';
import { User } from '@rahino/database';
import { GetUserActionReportDto } from './dto/user-action-report.dto';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class UserActionReportService {
  constructor(
    @InjectModel(BPMNRequestHistory)
    private readonly requestHistoryRepository: typeof BPMNRequestHistory,
  ) {}

  async findAll(dto: GetUserActionReportDto) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({
        createdAt: {
          [Op.between]: [dto.startDate, dto.endDate],
        },
      })
      .filterIf(dto.organizationId != null, {
        '$request.organizationId$': dto.organizationId,
      })
      .include([
        {
          model: BPMNRequest,
          as: 'request',
          required: true,
        },
        {
          model: BPMNNode,
          as: 'node',
          where: {
            autoExecute: false,
          },
          required: true,
        },
        {
          model: User,
          as: 'fromUser',
          attributes: ['firstname', 'lastname'],
        },
        {
          model: BPMNActivity,
          as: 'fromActivity',
          attributes: ['name'],
        },
        {
          model: BPMNActivity,
          as: 'toActivity',
          attributes: ['name'],
        },
      ])
      .attributes([
        'fromUserId',
        'fromActivityId',
        'toActivityId',
        'nodeId',
        [Sequelize.fn('COUNT', Sequelize.col('BPMNRequestHistory.id')), 'count'],
      ])
      .group([
        'fromUserId',
        'fromActivityId',
        'toActivityId',
        'nodeId',
        'fromUser.firstname',
        'fromUser.lastname',
        'fromActivity.name',
        'toActivity.name',
      ])
      .offset(dto.offset)
      .limit(dto.limit);

    return await this.requestHistoryRepository.findAll(queryBuilder.build());
  }
}
