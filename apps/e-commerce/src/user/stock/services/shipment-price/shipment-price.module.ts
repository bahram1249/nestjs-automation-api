import { DynamicModule, Module } from '@nestjs/common';
import { ShipmentOptions } from './interface';
import { ConfigService } from '@nestjs/config';
import { JahizanShipmentPrice } from './jahizan-shipment-price.service';
import { PostShipmentPriceService } from './post-shipment-price.service';
import { ECPostageFee } from '@rahino/database/models/ecommerce-eav/ec-postage-fee.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';
import { Setting } from '@rahino/database/models/core/setting.entity';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { GoldonShipmentPrice } from './goldon-shipment-price.service';
import { TipaxShipmentPrice } from './tipax.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPostageFee, ECAddress, Setting, ECDiscount]),
    SequelizeModule,
  ],
  providers: [
    JahizanShipmentPrice,
    PostShipmentPriceService,
    GoldonShipmentPrice,
    TipaxShipmentPrice,
  ],
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
            GoldonShipmentPrice,
          ],
          useFactory: (
            config: ConfigService,
            jahizanShipmentPrice: JahizanShipmentPrice,
            postShipmentPrice: PostShipmentPriceService,
            goldonGalleryShipmentPrice: GoldonShipmentPrice,
          ) => {
            const siteName = config.get('SITE_NAME');
            switch (siteName) {
              case 'jahizan':
                return jahizanShipmentPrice;
              case 'goldongallery':
                return goldonGalleryShipmentPrice;
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
