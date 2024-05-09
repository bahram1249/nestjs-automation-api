import { DynamicModule, Module } from '@nestjs/common';
import { ShipmentOptions } from './interface';
import { ConfigService } from '@nestjs/config';
import { JahizanShipmentPrice } from './jahizan-shipment-price.service';
import { PostShipmentPriceService } from './post-shipment-price.service';
import { ECPostageFee } from '@rahino/database/models/ecommerce-eav/ec-postage-fee.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';
import { Setting } from '@rahino/database/models/core/setting.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPostageFee, ECAddress, Setting]),
    SequelizeModule,
  ],
  providers: [JahizanShipmentPrice, PostShipmentPriceService],
})
export class ShipmentModule {
  static register(options: ShipmentOptions): DynamicModule {
    return {
      module: ShipmentModule,
      providers: [
        {
          provide: options.token,
          inject: [
            ConfigService,
            JahizanShipmentPrice,
            PostShipmentPriceService,
          ],
          useFactory: (
            config: ConfigService,
            jahizanShipmentPrice: JahizanShipmentPrice,
            postShipmentPrice: PostShipmentPriceService,
          ) => {
            const siteName = config.get('SITE_NAME');
            switch (siteName) {
              case 'jahizan':
                return jahizanShipmentPrice;
              default:
                return postShipmentPrice;
            }
          },
        },
      ],
      exports: [options.token],
    };
  }
}
