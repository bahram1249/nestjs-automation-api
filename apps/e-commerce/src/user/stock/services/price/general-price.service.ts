import { Injectable } from '@nestjs/common';
import { CalPriceInterface, TotalPriceInterface } from './interface';
import { ECStock } from '@rahino/database/models/ecommerce-eav/ec-stocks.entity';
import { StockPriceDto } from '../../dto';
import { ECPostageFee } from '@rahino/database/models/ecommerce-eav/ec-postage-fee.entity';
import { InjectModel } from '@nestjs/sequelize';
import { VariationPriceEnum } from '../../enum';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class GeneralPrice implements CalPriceInterface {
  constructor(
    @InjectModel(ECPostageFee)
    private readonly postageFeeRepository: typeof ECPostageFee,
  ) {}
  async cal(
    stocks: ECStock[],
    stockPrice: StockPriceDto,
    variationPriceId: number,
  ): Promise<TotalPriceInterface> {
    if (stocks.find((stock) => stock.product.inventories.length == 0)) {
      return { error: 1 };
    }
    if (
      variationPriceId == VariationPriceEnum.firstPrice &&
      stocks.filter((stock) => stock.product.inventories[0].firstPrice != null)
        .length != stocks.length
    ) {
      return { error: 2 };
    }
    if (
      variationPriceId == VariationPriceEnum.secondaryPrice &&
      stocks.filter(
        (stock) => stock.product.inventories[0].secondaryPrice != null,
      ).length != stocks.length
    ) {
      return { error: 2 };
    }

    const weights = stocks.map((stock) => stock.product.inventories[0].weight);
    const totalWeight = weights.reduce((prev, current) => prev + current);
    let postageFee = await this.postageFeeRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.literal(`${totalWeight}`), {
            [Op.between]: [
              Sequelize.col('ECPostageFee.fromWeight'),
              Sequelize.col('ECPostageFee.toWeight'),
            ],
          }),
        )
        .build(),
    );
    if (!postageFee) {
      postageFee = await this.postageFeeRepository.findOne(
        new QueryOptionsBuilder()
          .order({ orderBy: 'id', sortOrder: 'DESC' })
          .build(),
      );
    }

    if (variationPriceId == VariationPriceEnum.firstPrice) {
      const totalPrices = stocks.map(
        (stock) =>
          Number(stock.product.inventories[0].firstPrice.price) * stock.qty,
      );
      const sumTotalPrice = totalPrices.reduce(
        (prewPrice, currentPrice) => prewPrice + currentPrice,
      );
      const newPrices = stocks.map((stock) =>
        stock.product.inventories[0].firstPrice.appliedDiscount
          ? stock.product.inventories[0].firstPrice.appliedDiscount.newPrice *
            stock.qty
          : Number(stock.product.inventories[0].firstPrice.price) * stock.qty,
      );
      const sumNewPrice = newPrices.reduce((prev, current) => prev + current);
      const totalDiscounts = Number(sumTotalPrice) - sumNewPrice;
      const payPrice = Number(sumTotalPrice) - totalDiscounts;
      return {
        totalDiscounts: totalDiscounts,
        totalSum: payPrice + Number(postageFee.allProvincePrice),
        totalPrice: Number(sumTotalPrice),
        totalPostageFee: Number(postageFee.allProvincePrice),
      };
    } else if (variationPriceId == VariationPriceEnum.secondaryPrice) {
      const totalPrices = stocks.map(
        (stock) =>
          Number(stock.product.inventories[0].secondaryPrice.price) * stock.qty,
      );
      const sumTotalPrice = totalPrices.reduce(
        (prewPrice, currentPrice) => prewPrice + currentPrice,
      );
      const newPrices = stocks.map((stock) =>
        stock.product.inventories[0].secondaryPrice.appliedDiscount
          ? stock.product.inventories[0].secondaryPrice.appliedDiscount
              .newPrice * stock.qty
          : Number(stock.product.inventories[0].secondaryPrice.price) *
            stock.qty,
      );
      const sumNewPrice = newPrices.reduce((prev, current) => prev + current);
      const totalDiscounts = Number(sumTotalPrice) - sumNewPrice;
      const payPrice = Number(sumTotalPrice) - totalDiscounts;
      return {
        totalDiscounts: totalDiscounts,
        totalSum: payPrice + Number(postageFee.allProvincePrice),
        totalPrice: Number(sumTotalPrice),
        totalPostageFee: Number(postageFee.allProvincePrice),
      };
    }
  }
}
