import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ECInventoryPrice } from '@rahino/localdatabase/models';
import { ECStock } from '@rahino/localdatabase/models';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import { StockPriceInterface, VariationStockInterface } from './interface';
import * as _ from 'lodash';
import { VariationPriceEnum } from '../../enum';

@Injectable()
export class StockPriceService {
  constructor() {}
  async calByStock(
    stock: ECStock,
    variationPrice: ECVariationPrice,
    couponCode?: string,
  ): Promise<StockPriceInterface> {
    const result: StockPriceInterface = {
      stockId: stock.id,
      productId: stock.productId,
      inventoryId: stock.inventoryId,
      variationPrice: variationPrice,
      qty: stock.qty,
    };
    let price: ECInventoryPrice = null;
    if (
      variationPrice.id == VariationPriceEnum.firstPrice &&
      stock.product.inventories[0].firstPrice == null
    ) {
      result.error = 100;
      return result;
    }
    if (
      variationPrice.id == VariationPriceEnum.secondaryPrice &&
      stock.product.inventories[0].secondaryPrice == null
    ) {
      result.error = 100;
      return result;
    }
    switch (variationPrice.id) {
      case stock.product.inventories[0].firstPrice.variationPrice.id:
        price = stock.product.inventories[0].firstPrice;
        break;
      case stock.product.inventories[0].secondaryPrice.variationPrice.id:
        price = stock.product.inventories[0].secondaryPrice;
        break;
      default:
        throw new InternalServerErrorException(
          'something failed on choosing price',
        );
    }
    result.basePrice = Number(price.price);
    result.inventoryPriceId = price.id;
    result.afterDiscount = price.appliedDiscount
      ? Number(price.appliedDiscount.newPrice)
      : Number(price.price);
    result.discountId = price.appliedDiscount ? price.appliedDiscount.id : null;
    result.couponCode = couponCode;
    result.totalProductPrice = result.basePrice * stock.qty;
    result.totalPrice = result.afterDiscount * stock.qty;
    result.discountFeePerItem = result.basePrice - result.afterDiscount;
    result.discountFee = (result.basePrice - result.afterDiscount) * stock.qty;
    result.freeShipment = price.appliedDiscount?.freeShipment;
    result.weight = stock.product.weight;
    result.vendorId = stock.product.inventories[0].vendorId;
    return result;
  }

  async calByStocks(
    stocks: ECStock[],
    variationPrice: ECVariationPrice,
    couponCode?: string,
  ): Promise<StockPriceInterface[]> {
    const priceofStocks: StockPriceInterface[] = [];
    for (let index = 0; index < stocks.length; index++) {
      const stock = stocks[index];
      const result = await this.calByStock(stock, variationPrice, couponCode);
      priceofStocks.push(result);
    }
    return priceofStocks;
  }

  async calByVariationPrices(
    stocks: ECStock[],
    variationPrices: ECVariationPrice[],
    couponCode?: string,
  ): Promise<VariationStockInterface[]> {
    const results: VariationStockInterface[] = [];
    for (let index = 0; index < variationPrices.length; index++) {
      const variationPrice = variationPrices[index];
      const result = await this.calByStocks(stocks, variationPrice, couponCode);
      const withoutErrorItems = result.filter((item) => item.error == null);
      if (
        withoutErrorItems.length != result.length &&
        variationPrice.required == true
      ) {
        throw new InternalServerErrorException(
          'something failed on calculating price',
        );
      }
      if (withoutErrorItems.length == result.length) {
        results.push({ variationPrice: variationPrice, stocks: result });
      }
    }
    return results;
  }
}
