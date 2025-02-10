import { Injectable } from '@nestjs/common';
import { CheckConditionsDto } from '@rahino/bpmn/modules/condition';
import { ConditionServiceImp } from '@rahino/bpmn/modules/condition/interface';

@Injectable({})
export class SampleConditionService implements ConditionServiceImp {
  constructor() {}
  async check(dto: CheckConditionsDto): Promise<boolean> {
    let a = 1;
    let b = 2;
    return a == b;
  }
}
