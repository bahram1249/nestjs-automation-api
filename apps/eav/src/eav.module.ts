import { Module } from '@nestjs/common';
import { AttributeModule } from './admin/attribute/attribute.module';
import { AttributeTypeModule } from './admin/attribute-type/attribute-type.module';

@Module({
  imports: [AttributeModule, AttributeTypeModule],
})
export class EAVModule {}
