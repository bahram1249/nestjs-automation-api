import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNPROCESS } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(BPMNPROCESS)
    private readonly processRepository: typeof BPMNPROCESS,
  ) {}

  async findByStaticId(staticId: number) {
    return await this.processRepository.findOne(
      new QueryOptionsBuilder().filter({ staticId: staticId }).build(),
    );
  }
}
