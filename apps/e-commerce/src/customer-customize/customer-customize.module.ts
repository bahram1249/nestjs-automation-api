import { Module } from '@nestjs/common';
import { GoldModule } from './gold/gold.module';

@Module({
  imports: [GoldModule],
})
export class CustomerCustomizeMoudle {}
