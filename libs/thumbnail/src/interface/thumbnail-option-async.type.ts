import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { ThumbnailOptions } from './thumbnail-option.interface';

type ThumbnailAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<ThumbnailOptions>, 'useFactory' | 'inject'>;

export default ThumbnailAsyncOptions;
