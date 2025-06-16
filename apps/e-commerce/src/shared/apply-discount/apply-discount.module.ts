import { Module } from '@nestjs/common';
import { ApplyDiscountService } from './apply-discount.service';
import { RedisClientModule } from '@rahino/redis-client';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscount } from '@rahino/localdatabase/models';

@Module({
  imports: [RedisClientModule, SequelizeModule.forFeature([ECDiscount])],
  providers: [ApplyDiscountService],
  exports: [ApplyDiscountService],
})
export class ApplyDiscountModule {}
