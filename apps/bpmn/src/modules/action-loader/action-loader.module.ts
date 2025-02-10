import { DynamicModule, Module } from '@nestjs/common';
import { loadActionModules } from './load-action-module.util';
import { ActionLoaderService } from './action-loader.service';

@Module({})
export class ActionLoaderModule {
  static async register(): Promise<DynamicModule> {
    const actionModules = await loadActionModules(
      '../../dynamic-action/guarantee',
    );
    return {
      module: ActionLoaderModule,
      imports: [...actionModules], // Dynamically import action modules
      providers: [ActionLoaderService],
      exports: [ActionLoaderService],
    };
  }
}
