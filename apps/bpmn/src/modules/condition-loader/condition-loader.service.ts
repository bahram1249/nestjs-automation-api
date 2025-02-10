import { Injectable } from '@nestjs/common';
import { ExecuteConditionDto } from './dto';
import { ModuleRef } from '@nestjs/core';
import { ConditionServiceImp } from '../condition/interface';

@Injectable()
export class ConditionLoaderService {
  constructor(private readonly moduleRef: ModuleRef) {}

  async executeCondition(dto: ExecuteConditionDto): Promise<boolean> {
    const serviceInstance: ConditionServiceImp =
      await this.moduleRef.get<ConditionServiceImp>(dto.source, {
        strict: false,
      });

    if (!serviceInstance) {
      throw new Error(`Service with token ${dto.source} not found`);
    }

    // Execute the action
    return await serviceInstance.check({
      node: dto.checkCondition.node,
      request: dto.checkCondition.request,
      requestState: dto.checkCondition.requestState,
      transaction: dto.checkCondition.transaction,
    });
  }
}
