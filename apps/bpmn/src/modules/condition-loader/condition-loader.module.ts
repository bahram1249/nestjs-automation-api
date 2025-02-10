import { DynamicModule, Module } from '@nestjs/common';
import { loadConditionModules } from './load-condition-modules.util';
import { ConditionLoaderService } from './condition-loader.service';

@Module({})
export class ConditionLoaderModule {
  static async register(): Promise<DynamicModule> {
    const conditionModules = await loadConditionModules(
      '../../dynamic-condition/guarantee',
    );
    return {
      module: ConditionLoaderModule,
      imports: [...conditionModules], // Dynamically import action modules
      providers: [ConditionLoaderService],
      exports: [ConditionLoaderService],
    };
  }
}
