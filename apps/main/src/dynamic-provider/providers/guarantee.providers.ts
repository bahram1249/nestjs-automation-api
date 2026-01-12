import { BPMNModule } from '@rahino/bpmn';
import { CoreModule } from '@rahino/core';
import { GSModule } from 'apps/guarantee/src';

export const guaranteeProviders = [CoreModule, BPMNModule, GSModule];
