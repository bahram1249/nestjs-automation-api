import { Module } from '@nestjs/common';
import { PriceFormulaService } from './price-formula.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { PriceFormulaController } from './price-formula.controller';
import { ECProductPriceFormula } from '@rahino/database/models/ecommerce-eav/ec-product-price-formula';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECProductPriceFormula]),
  ],
  controllers: [PriceFormulaController],
  providers: [PriceFormulaService],
})
export class PriceFormulaModule {}
