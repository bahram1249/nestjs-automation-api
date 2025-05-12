import { Module } from '@nestjs/common';
import { VariationPriceService } from './variation-price.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import { VariationPriceController } from './variation-price.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECVariationPrice])],
  controllers: [VariationPriceController],
  providers: [VariationPriceService],
})
export class VariationPriceModule {}
