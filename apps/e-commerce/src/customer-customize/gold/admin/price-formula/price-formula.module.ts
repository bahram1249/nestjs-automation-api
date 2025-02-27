import { Module } from '@nestjs/common';
import { PriceFormulaService } from './price-formula.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { PriceFormulaController } from './price-formula.controller';
import { ECProductPriceFormula } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECProductPriceFormula]),
  ],
  controllers: [PriceFormulaController],
  providers: [PriceFormulaService],
})
export class PriceFormulaModule {}
