import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { BPMNActivity, BPMNPROCESS } from '@rahino/localdatabase/models/bpmn';
import { Op, Sequelize } from 'sequelize';
import { User } from '@rahino/database';

@Injectable()
export class AllActivitiesService {
  constructor(
    @InjectModel(BPMNActivity)
    private readonly activityRepository: typeof BPMNActivity,
  ) {}

  async findAll(user: User) {
    const queryBuilder = new QueryOptionsBuilder();
    queryBuilder
      .attributes(['id', 'name', 'processId'])
      .include([{ model: BPMNPROCESS, as: 'process', required: true }])
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('bpmnActivity.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('process.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .order(['processId', 'ASC']);

    const result = await this.activityRepository.findAll(queryBuilder.build());
    return {
      result: result,
      total: result.length,
    };
  }
}
