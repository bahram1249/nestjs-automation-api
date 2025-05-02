import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { GSFactorTypeEnum } from '@rahino/guarantee/shared/factor-type';
import { GSFactor } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class ResetFactorActionService implements ActionServiceImp {
  constructor(
    @InjectModel(GSFactor) private readonly factorRepository: typeof GSFactor,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    let factor = await this.factorRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ requestId: dto.request.id })
        .filter({ factorTypeId: GSFactorTypeEnum.PayRequestFactor })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSFactor.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .transaction(dto.transaction)
        .build(),
    );
    if (factor) {
      factor.isDeleted = true;
      await factor.save({ transaction: dto.transaction });
    }
  }
}
