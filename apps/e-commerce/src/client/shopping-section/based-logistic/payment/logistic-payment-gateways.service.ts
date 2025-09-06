import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ECPaymentGateway,
  ECVariationPrice,
} from '@rahino/localdatabase/models';
import { ECUserSession } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { StockService } from '@rahino/ecommerce/user/shopping/stock/stock.service';
import { StockPriceService } from '@rahino/ecommerce/user/shopping/stock/services/price';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';

@Injectable()
export class LogisticPaymentGatewaysService {
  constructor(
    private readonly stockService: StockService,
    private readonly priceService: StockPriceService,
    @InjectModel(ECPaymentGateway)
    private readonly gatewayRepo: typeof ECPaymentGateway,
    @InjectModel(ECVariationPrice)
    private readonly variationPriceRepo: typeof ECVariationPrice,
    private readonly l10n: LocalizationService,
  ) {}

  async list(
    session: ECUserSession,
  ): Promise<Array<{ id: number; name: string; imageUrl: string }>> {
    // Get enriched active stocks from StockService
    const { result: allStocks } = await this.stockService.findAll(session);

    // Filter available items with sufficient qty
    const stocks = (allStocks || []).filter(
      (stock) =>
        stock?.product?.inventoryStatusId === InventoryStatusEnum.available &&
        stock?.product?.inventories?.[0]?.qty >= stock?.qty,
    );

    if (!stocks || stocks.length === 0) {
      throw new BadRequestException(
        this.l10n.translate('ecommerce.no_active_stock_in_session'),
      );
    }

    // Load all variation prices and group stocks by variation prices via price service
    const variationPrices = await this.variationPriceRepo.findAll();
    const variationPriceStocks = await this.priceService.calByVariationPrices(
      stocks,
      variationPrices,
      null,
    );

    // For each variation price, collect supported gateways
    const gatewayMap = new Map<
      number,
      {
        id: number;
        name: string;
        imageUrl: string;
        variationPriceId: number;
        variationPriceTitle: string;
      }
    >();
    for (const vps of variationPriceStocks) {
      const gateways = await this.gatewayRepo.findAll(
        new QueryOptionsBuilder()
          .include([
            {
              model: ECVariationPrice,
              attributes: ['id', 'name'],
              required: true,
            },
          ])
          .attributes(['id', 'name', 'imageUrl', 'variationPriceId'])
          .filter({ variationPriceId: vps.variationPrice.id })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECPaymentGateway.isDeleted'),
                0,
              ),
              { [Op.eq]: 0 },
            ),
          )
          .build(),
      );

      for (const g of gateways || []) {
        const id = g.id as any as number;
        if (!gatewayMap.has(id)) {
          gatewayMap.set(id, {
            id,
            name: g.name,
            imageUrl: g.imageUrl,
            variationPriceId: g.variationPriceId,
            variationPriceTitle: g.variationPrice.name,
          });
        }
      }
    }

    return Array.from(gatewayMap.values());
  }
}
