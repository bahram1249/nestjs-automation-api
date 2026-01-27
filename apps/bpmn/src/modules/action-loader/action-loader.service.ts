import { Injectable } from '@nestjs/common';
import { TryExecuteActionDto } from './dto';
import { ModuleRef } from '@nestjs/core';
import { ActionServiceImp } from '../action/interface';

@Injectable()
export class ActionLoaderService {
  constructor(private readonly moduleRef: ModuleRef) {}

  async tryExecuteAction(dto: TryExecuteActionDto): Promise<boolean> {
    const serviceInstance: ActionServiceImp =
      await this.moduleRef.get<ActionServiceImp>(dto.source, {
        strict: false,
      });

    if (!serviceInstance) {
      throw new Error(`Service with token ${dto.source} not found`);
    }

    // Execute the action
    return await serviceInstance.executeAction(dto.sourceExecuteAction);
  }
}
