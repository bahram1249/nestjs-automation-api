import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import {
  ECDiscount,
  ECInventory,
  ECShippingWay,
  ECShoppingCart,
  ECShoppingCartProduct,
  ECUserSession,
  ECVendor,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import {
  AddProductShoppingCartDto,
  ApplyShoppingCartProductCouponDiscountOutputDto,
  FormatShoppingCartProductOutputDto,
  GetShoppingCartDto,
  GetShoppingPriceDto,
  ShoppingCartDto,
} from './dto';
import { ShoppingCartProductDto } from './dto/shopping-cart-product.dto';
import { ListFilter } from '@rahino/query-filter';
import { emptyListFilter } from '@rahino/query-filter/provider/constants';
import * as _ from 'lodash';
import { ProductRepositoryService } from '@rahino/ecommerce/product/service/product-repository.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { InventoryService } from '@rahino/ecommerce/inventory/services';
import { ConfigService } from '@nestjs/config';
import { addDays, isNotNullOrEmpty } from '@rahino/commontools';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';
import { InjectQueue } from '@nestjs/bullmq';
import {
  SHOPPING_CART_PRODUCT_REMOVE_JOB,
  SHOPPING_CART_PRODUCT_REMOVE_QUEUE,
} from './constants';
import { Queue } from 'bullmq';
import { ApplyDiscountService } from '@rahino/ecommerce/product/service';
import { defaultValueIsNull } from '@rahino/commontools/functions/default-value-isnull';
import { NEARBY_SHOPPING_KM } from '@rahino/ecommerce/shared/constants';
import { Setting } from '@rahino/database';
import { CourierPriceEnum } from '@rahino/ecommerce/admin/order-section/courier-price/enum';
@Injectable()
export class ShoppingCartService {
  private readonly distanceMeters = NEARBY_SHOPPING_KM * 1000;
  constructor(
    @InjectModel(ECShoppingCart)
    private readonly shoppingCartRepository: typeof ECShoppingCart,
    @InjectModel(ECShoppingCartProduct)
    private readonly shoppingCartProductRepository: typeof ECShoppingCartProduct,
    @Inject(emptyListFilter)
    private readonly emptyListFilter: ListFilter,
    private readonly productRepositoryService: ProductRepositoryService,
    private readonly localizationService: LocalizationService,
    private readonly inventorySerivice: InventoryService,
    private readonly config: ConfigService,
    private readonly applyDiscountService: ApplyDiscountService,
    @InjectModel(ECVendor)
    private readonly vendorRepository: typeof ECVendor,
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,

    @InjectConnection()
    private readonly sequelize: Sequelize,

    @InjectQueue(SHOPPING_CART_PRODUCT_REMOVE_QUEUE)
    private readonly shoppingCartProductRemoveQueue: Queue,
  ) {}

  async findAll(
    filter: GetShoppingCartDto,
    session: ECUserSession,
  ): Promise<ShoppingCartDto[]> {
    const shoppingCarts = await this.shoppingCartRepository.findAll(
      new QueryOptionsBuilder()
        .include([
          {
            model: ECShoppingCartProduct,
            as: 'shoppingCartProducts',
            where: {
              isDeleted: {
                [Op.is]: null,
              },
            },
            required: true,
          },
          {
            attributes: ['id', 'name', 'slug', 'latitude', 'longitude'],
            model: ECVendor,
            as: 'vendor',
          },
          {
            attributes: ['id', 'title'],
            model: ECShippingWay,
            as: 'shippingWay',
          },
        ])
        .filter({ sessionId: session.id })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECShoppingCart.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECShoppingCart.isPurchase'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filterIf(filter.vendorId != null, { vendorId: filter.vendorId })
        .filterIf(filter.shoppingCartId != null, {
          id: filter.shoppingCartId,
        })
        .build(),
    );
    return await this.mappingShoppingCart(shoppingCarts);
  }

  async getShoppingPrice(filter: GetShoppingPriceDto, session: ECUserSession) {
    const shoppingCartItems = await this.getShoppingCartElements(
      filter,
      session,
    );

    let totalShipmentPrice = 0;
    let allowProcess = false;

    // total discount
    // realprice of item product
    // product price after discount
    // total price

    const totalPrice = shoppingCartItems
      .map((shoppingCartItem) => shoppingCartItem.totalPrice)
      .reduce((prev, current) => prev + current, 0);
    const totalDiscount = shoppingCartItems
      .map((shoppingCartItem) => shoppingCartItem.discountFee)
      .reduce((prev, current) => prev + current, 0);
    const totalProductPrice = shoppingCartItems
      .map((shoppingCartItem) => shoppingCartItem.totalProductPrice)
      .reduce((prev, current) => prev + current, 0);

    if (
      shoppingCartItems.length > 0 &&
      isNotNullOrEmpty(filter.latitude) &&
      isNotNullOrEmpty(filter.longitude)
    ) {
      const vendorId = shoppingCartItems[0].vendorId;

      const vendors = await this.sequelize.query(
        `
        SELECT 
          id, 
          name, 
          coordinates.STDistance(geography::Point(:latitude, :longitude, 4326)) AS distanceInMeters
        FROM 
          ECVendors
        WHERE id = :vendorId
      `,
        {
          replacements: {
            latitude: filter.latitude,
            longitude: filter.longitude,
            vendorId: vendorId,
          },
          type: QueryTypes.SELECT, // Ensures you get plain objects
        },
      );
      const vendor = vendors[0];

      const vendorDistanceInMeters = vendor['distanceInMeters'] as number;

      if (vendorDistanceInMeters <= this.distanceMeters) {
        allowProcess = true;

        const baseCourierPrice = await this.settingRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ key: CourierPriceEnum.BASE_COURIER_PRICE })
            .build(),
        );
        const courierPriceByKilometer = await this.settingRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ key: CourierPriceEnum.COURIER_PRICE_BY_KILOMETRE })
            .build(),
        );

        const km = vendorDistanceInMeters / 1000;

        totalShipmentPrice;
        Number(baseCourierPrice.value) +
          km * Number(courierPriceByKilometer.value);
      }
    }

    return {
      result: {
        totalPrice,
        totalDiscount,
        totalProductPrice,
        totalShipmentPrice,
        allowProcess,
      },
    };
  }

  async getShoppingCartElements(
    filter: GetShoppingPriceDto,
    session: ECUserSession,
  ): Promise<FormatShoppingCartProductOutputDto[]> {
    const shoppingCarts = await this.findAll(
      { shoppingCartId: filter.shoppingCartId },
      session,
    );

    if (shoppingCarts.length == 0) {
      return [];
    }

    const shoppingCart = shoppingCarts[0];

    let shoppingCartProducts = shoppingCart.shoppingProducts.filter(
      (shoppingCartProduct) =>
        shoppingCartProduct.product.inventoryStatusId ==
          InventoryStatusEnum.available &&
        shoppingCartProduct.product.inventories[0].qty >=
          shoppingCartProduct.qty,
    );

    // apply discount coupon
    if (isNotNullOrEmpty(filter.couponCode)) {
      const result = await this.applyDiscountCoupon(
        shoppingCartProducts,
        filter.couponCode,
      );
      shoppingCartProducts = result.shoppingCartProducts;
    }

    await this.formatShoppingProducts(shoppingCartProducts);
  }

  private async applyDiscountCoupon(
    shoppingCartProducts: ShoppingCartProductDto[],
    couponCode: string,
  ): Promise<{
    shoppingCartProducts: ShoppingCartProductDto[];
    discount: ECDiscount;
    countApplied: number;
  }> {
    const discount =
      await this.applyDiscountService.findDiscountByCouponCode(couponCode);
    if (!discount) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.cannot_find_discount_coupon',
        ),
      );
    }
    const result = await this._canApplyCouponDiscount(
      shoppingCartProducts,
      discount,
    );

    return {
      shoppingCartProducts: result.shoppingCartProducts,
      discount: discount,
      countApplied: result.appliedItem,
    };
  }

  private async _canApplyCouponDiscount(
    shoppingCartProducts: ShoppingCartProductDto[],
    discount: ECDiscount,
  ) {
    const available =
      defaultValueIsNull(discount.limit, 0) -
      defaultValueIsNull(discount.used, 0);
    if (discount.limit != null && available <= 0) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.you_dont_allow_to_use_this_coupon_code',
        ),
      );
    }
    const promises = [];
    for (let index = 0; index < shoppingCartProducts.length; index++) {
      let shoppingCartProduct = shoppingCartProducts[index];
      promises.push(
        this._applyShoppingCartProductCouponDiscount(
          shoppingCartProduct,
          discount,
        ),
      );
    }
    const results: ApplyShoppingCartProductCouponDiscountOutputDto[] =
      await Promise.all(promises);
    const shoppingCartProductsEdited: ShoppingCartProductDto[] = results.map(
      (results) => results.shoppingCartProduct,
    );
    const appliedItem: number = results
      .map((results) => results.countApllied)
      .reduce((prev, current) => prev + current, 0);
    if (appliedItem == 0) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.cannot_find_any_coupon_code_for_this_selected_product',
        ),
      );
    }
    if (appliedItem > available && discount.limit != null) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_maximum_of_used_this_coupon_code_reach',
        ),
      );
    }
    return { shoppingCartProducts: shoppingCartProductsEdited, appliedItem };
  }

  private async _applyShoppingCartProductCouponDiscount(
    shoppingCartProduct: ShoppingCartProductDto,
    discount: ECDiscount,
  ): Promise<ApplyShoppingCartProductCouponDiscountOutputDto> {
    // quantity of applied
    let countApllied = 0;
    let { inventory, applied } =
      await this.applyDiscountService._applyCopunCodeToInventory(
        shoppingCartProduct.product,
        shoppingCartProduct.product.inventories[0],
        discount,
      );

    if (applied) {
      // set count of applied
      countApllied = shoppingCartProduct.qty;
    }
    shoppingCartProduct.product.inventories[0] = inventory;
    return {
      shoppingCartProduct: shoppingCartProduct,
      countApllied: countApllied,
    };
  }

  private async formatShoppingProducts(
    shoppingCartProducts: ShoppingCartProductDto[],
  ): Promise<FormatShoppingCartProductOutputDto[]> {
    const mappedShoppingProducts = shoppingCartProducts.map(
      async (
        shoppingCartProduct,
      ): Promise<FormatShoppingCartProductOutputDto> => {
        return this.formatShoppingProduct(shoppingCartProduct);
      },
    );

    return await Promise.all(mappedShoppingProducts);
  }

  private formatShoppingProduct(
    shoppingCartProduct: ShoppingCartProductDto,
  ): FormatShoppingCartProductOutputDto {
    let output: FormatShoppingCartProductOutputDto =
      new FormatShoppingCartProductOutputDto();
    output.shoppingCartId = shoppingCartProduct.shoppingCartId;
    output.shoppingCartProductId = shoppingCartProduct.id;
    output.productId = shoppingCartProduct.productId;
    output.inventoryId = shoppingCartProduct.inventoryId;
    output.basePrice =
      shoppingCartProduct.product.inventories[0].firstPrice.price;
    output.qty = shoppingCartProduct.qty;
    output.discountId =
      shoppingCartProduct.product.inventories[0].firstPrice?.appliedDiscount
        ?.id;
    output.inventoryPriceId =
      shoppingCartProduct.product.inventories[0].firstPrice.id;
    output.variationPriceId =
      shoppingCartProduct.product.inventories[0].firstPrice.variationPriceId;
    output.vendorId = shoppingCartProduct.product.inventories[0].vendorId;
    output.afterDiscount = shoppingCartProduct.product.inventories[0].firstPrice
      ?.appliedDiscount
      ? shoppingCartProduct.product.inventories[0].firstPrice?.appliedDiscount
          .newPrice
      : output.basePrice;

    output.discountFeePerItem = output.basePrice - output.afterDiscount;
    output.discountFee = Number(output.discountFeePerItem) * output.qty;
    output.totalProductPrice = Number(output.basePrice) * output.qty;
    output.totalPrice = Number(output.afterDiscount) * output.qty;
    return output;
  }

  async addProduct(session: ECUserSession, product: AddProductShoppingCartDto) {
    const inventory = await this.inventorySerivice.findById(
      product.inventoryId,
    );
    if (!inventory) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_inventory_isnt_available',
        ),
      );
    }

    let shoppingCart = await this.findCurrentlyShoppingCart(inventory, session);

    if (!shoppingCart) {
      shoppingCart = await this.createShoppingCart(inventory, session);
    }

    const currentProduct = await this.findProductInShoppingCart(
      shoppingCart,
      inventory.productId,
      inventory.id,
    );

    if (currentProduct) {
      product.qty = product.qty + currentProduct.qty;
    }
    if (product.qty > inventory.qty) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_inventory_isnt_available',
        ),
      );
    }

    if (product.qty <= 0) {
      if (currentProduct)
        await this.removeShoppingCartProduct(session, currentProduct.id);
      return {
        result: this.localizationService.translate('core.success'),
      };
    }

    if (currentProduct) {
      currentProduct.qty = product.qty;
      await currentProduct.save();
    } else {
      await this.createShoppingCartProduct(shoppingCart, inventory, product);
    }

    return {
      result: this.localizationService.translate('core.success'),
    };
    //return await this.findAll({ shoppingCartId: shoppingCart.id }, session);
  }

  async removeShoppingCart(session: ECUserSession, shoppingCartId: bigint) {
    const shoppingCart = await this.shoppingCartRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: shoppingCartId })
        .filter({ sessionId: session.id })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECShoppingCart.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECShoppingCart.isPurchase'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!shoppingCart) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.shipping_card_is_not_founded',
        ),
      );
    }

    shoppingCart.isDeleted = true;
    await shoppingCart.save();

    return {
      result: this.localizationService.translate('core.success'),
    };
  }

  async removeShoppingCartProduct(
    session: ECUserSession,
    shoppingCartProductId: bigint,
  ) {
    const shoppingCartProduct =
      await this.shoppingCartProductRepository.findOne(
        new QueryOptionsBuilder()
          .include([
            {
              model: ECShoppingCart,
              as: 'shoppingCart',
              required: true,
              where: {
                sessionId: session.id,
              },
            },
          ])
          .filter({ id: shoppingCartProductId })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECShoppingCartProduct.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );

    if (!shoppingCartProduct) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.shipping_card_product_is_not_founded',
        ),
      );
    }

    shoppingCartProduct.isDeleted = true;
    await shoppingCartProduct.save();

    return {
      result: this.localizationService.translate('core.success'),
    };
  }

  private async createShoppingCartProduct(
    shoppingCart: ECShoppingCart,
    inventory: ECInventory,
    product: AddProductShoppingCartDto,
  ): Promise<ECShoppingCartProduct> {
    return await this.shoppingCartProductRepository.create({
      shoppingCartId: shoppingCart.id,
      productId: inventory.productId,
      inventoryId: inventory.id,
      qty: product.qty,
    });
  }

  private async findProductInShoppingCart(
    shoppingCart: ECShoppingCart,
    productId: bigint,
    inventoryId: bigint,
  ): Promise<ECShoppingCartProduct> {
    return await this.shoppingCartProductRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ shoppingCartId: shoppingCart.id })
        .filter({ productId: productId })
        .filter({ inventoryId: inventoryId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECShoppingCartProduct.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
  }

  private async createShoppingCart(
    inventory: ECInventory,
    session: ECUserSession,
  ): Promise<ECShoppingCart> {
    const increase = this.config.get<number>('STOCK_EXPIRE_DAY') || 2;

    return await this.shoppingCartRepository.create({
      vendorId: inventory.vendorId,
      shippingWayId: inventory.product.entityType.shippingWayId,
      expire: addDays(new Date(), increase),
      sessionId: session.id,
    });
  }

  private async findCurrentlyShoppingCart(
    inventory: ECInventory,
    session: ECUserSession,
  ) {
    return await this.shoppingCartRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ shippingWayId: inventory.product.entityType.shippingWayId })
        .filter({ vendorId: inventory.vendorId })
        .filter({ sessionId: session.id })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECShoppingCart.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECShoppingCart.isPurchase'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          expire: {
            [Op.gt]: Sequelize.fn('getdate'),
          },
        })
        .build(),
    );
  }

  private async mappingShoppingCart(
    shoppingCarts: ECShoppingCart[],
  ): Promise<ShoppingCartDto[]> {
    const mappedCarts = shoppingCarts.map(
      async (shoppingCart): Promise<ShoppingCartDto> => {
        const shoppingProducts = await this.mappingShoppingCartProduct(
          shoppingCart.shoppingCartProducts,
        );

        return {
          id: shoppingCart?.id,
          sessionId: shoppingCart?.sessionId,
          shippingWayId: shoppingCart?.shippingWayId,
          expire: shoppingCart?.expire,
          vendorId: shoppingCart?.vendorId,
          vendor: {
            id: shoppingCart?.vendor?.id,
            title: shoppingCart?.vendor?.name,
            slug: shoppingCart?.vendor?.slug,
            latitude: shoppingCart?.vendor?.latitude,
            longitude: shoppingCart?.vendor?.longitude,
          },
          shoppingProducts,
        };
      },
    );

    return Promise.all(mappedCarts);
  }

  private async mappingShoppingCartProduct(
    products: ECShoppingCartProduct[],
  ): Promise<ShoppingCartProductDto[]> {
    const mappedProducts = products.map(
      async (product): Promise<ShoppingCartProductDto> => {
        const productFromRepository =
          await this.productRepositoryService.findById(
            _.extend(this.emptyListFilter, {
              inventoryId: product.inventoryId,
            }),
            product.productId,
            false,
          );

        if (
          productFromRepository.result.inventoryStatusId ==
            InventoryStatusEnum.unavailable ||
          productFromRepository.result.inventories[0].qty < product.qty
        ) {
          // make a job to remove this product from shopping cart
          await this.shoppingCartProductRemoveQueue.add(
            SHOPPING_CART_PRODUCT_REMOVE_JOB,
            {
              shoppingCartId: product.shoppingCartId,
              shoppingCartProductId: product.id,
            },
          );
        }
        return {
          id: product?.id,
          shoppingCartId: product?.shoppingCartId,
          productId: product?.productId,
          qty: product?.qty,
          inventoryId: product?.inventoryId,
          product: productFromRepository.result,
        };
      },
    );

    return Promise.all(mappedProducts);
  }
}
