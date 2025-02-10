import { Injectable } from '@nestjs/common';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';

@Injectable()
export class SampleActionService implements ActionServiceImp {
  constructor() {}
  async executeAction(dto: ExecuteActionDto) {
    console.log('action is executing');
  }
}
