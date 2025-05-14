import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { GSPointEnum } from '@rahino/guarantee/shared/gs-point';
import { GSPoint, GSUserPoint } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class PointInStartRequestActionService implements ActionServiceImp {
  constructor(
    @InjectModel(GSUserPoint) private readonly repository: typeof GSUserPoint,
    @InjectModel(GSPoint) private readonly pointRepository: typeof GSPoint,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const point = await this.pointRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: GSPointEnum.POINT_IN_START })
        .build(),
    );

    if (!point) {
      throw new Error('Point not found');
    }

    await this.repository.create(
      {
        userId: dto.request.userId,
        pointId: point.id,
        pointScore: point.point,
      },
      { transaction: dto.transaction },
    );
  }
}
