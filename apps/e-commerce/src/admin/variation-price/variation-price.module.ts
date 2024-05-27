import { Module } from '@nestjs/common';
import { VariationPriceService } from './variation-price.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { VariationPriceController } from './variation-price.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECVariationPrice])],
  controllers: [VariationPriceController],
  providers: [VariationPriceService],
})
export class VariationPriceModule {}
