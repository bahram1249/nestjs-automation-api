import { Injectable } from '@nestjs/common';
import { CheckConditionsDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNCondition } from '@rahino/database';

@Injectable()
export class ConditionService {
  constructor(
    @InjectModel(BPMNCondition)
    private readonly conditionRepository: typeof BPMNCondition,
  ) {}

  async checkConditions(dto: CheckConditionsDto): Promise<boolean> {
    let conditionResult = true;
    return conditionResult;
  }
}
