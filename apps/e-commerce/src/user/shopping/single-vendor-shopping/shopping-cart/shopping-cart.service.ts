import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

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
import { ListFilter } from '@rahino/query-filter';
import { emptyListFilter } from '@rahino/query-filter/provider/constants';
import { ProductRepositoryService } from '@rahino/ecommerce/client/product/service/product-repository.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { InventoryService } from '@rahino/ecommerce/shared/inventory/services';
import { addDays, isNotNullOrEmpty, sumProperty } from '@rahino/commontools';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';
import { ApplyDiscountService } from '@rahino/ecommerce/client/product/service';
import { defaultValueIsNull } from '@rahino/commontools/functions/default-value-isnull';
import { NEARBY_SHOPPING_KM } from '@rahino/ecommerce/shared/constants';
import { Setting } from '@rahino/database';
import { CourierPriceEnum } from '@rahino/ecommerce/admin/order-section/courier-price/enum';

import {
  SHOPPING_CART_PRODUCT_REMOVE_JOB,
  SHOPPING_CART_PRODUCT_REMOVE_QUEUE,
} from './constants';
import {
  AddProductShoppingCartDto,
  ApplyShoppingCartProductCouponDiscountOutputDto,
  FormatShoppingCartProductOutputDto,
  GetShoppingCartDto,
  GetShoppingPriceDto,
  ShoppingCartDto,
  ShoppingCartProductDto,
} from './dto';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class SingleVendorShoppingCartService {
  private readonly distanceMeters = NEARBY_SHOPPING_KM * 1000;

  constructor(
    @InjectModel(ECShoppingCart)
    private readonly shoppingCartRepository: typeof ECShoppingCart,
    @InjectModel(ECShoppingCartProduct)
    private readonly shoppingCartProductRepository: typeof ECShoppingCartProduct,
    @InjectModel(ECVendor)
    private readonly vendorRepository: typeof ECVendor,
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectQueue(SHOPPING_CART_PRODUCT_REMOVE_QUEUE)
    private readonly shoppingCartProductRemoveQueue: Queue,
    @Inject(emptyListFilter)
    private readonly emptyListFilter: ListFilter,
    private readonly productRepositoryService: ProductRepositoryService,
    private readonly localizationService: LocalizationService,
    private readonly inventoryService: InventoryService,
    private readonly config: ConfigService,
    private readonly applyDiscountService: ApplyDiscountService,
  ) {}

  // ==================== PUBLIC METHODS ====================

  async findAll(
    filter: GetShoppingCartDto,
    session: ECUserSession,
  ): Promise<ShoppingCartDto[]> {
    const shoppingCarts = await this.findActiveShoppingCarts(filter, session);
    return this.mapShoppingCartsToDto(shoppingCarts);
  }

  async getShoppingPrice(filter: GetShoppingPriceDto, session: ECUserSession) {
    const shoppingCartItems = await this.getShoppingCartElements(
      filter,
      session,
    );
    const priceSummary = this.calculatePriceSummary(shoppingCartItems);

    if (shoppingCartItems.length > 0 && this.hasValidLocation(filter)) {
      const { allowProcess, totalShipmentPrice } =
        await this.calculateShippingCost(
          shoppingCartItems[0].vendorId,
          filter.latitude,
          filter.longitude,
        );

      return {
        result: {
          totalPrice: priceSummary.totalPrice + totalShipmentPrice,
          totalDiscount: priceSummary.totalDiscount,
          totalProductPrice: priceSummary.totalProductPrice,
          totalShipmentPrice,
          allowProcess,
        },
      };
    }

    return {
      result: {
        ...priceSummary,
        totalShipmentPrice: 0,
        allowProcess: false,
      },
    };
  }

  async addProduct(session: ECUserSession, product: AddProductShoppingCartDto) {
    const inventory = await this.validateInventory(product.inventoryId);
    const shoppingCart = await this.findOrCreateShoppingCart(
      inventory,
      session,
    );

    await this.upsertProductInCart(shoppingCart, inventory, product);

    return {
      result: this.localizationService.translate('core.success'),
    };
  }

  async removeShoppingCart(session: ECUserSession, shoppingCartId: bigint) {
    const shoppingCart = await this.findActiveShoppingCartById(
      session,
      shoppingCartId,
    );
    await this.markShoppingCartAsDeleted(shoppingCart);

    return {
      result: this.localizationService.translate('core.success'),
    };
  }

  async removeShoppingCartProduct(
    session: ECUserSession,
    shoppingCartProductId: bigint,
  ) {
    const shoppingCartProduct = await this.findActiveShoppingCartProduct(
      session,
      shoppingCartProductId,
    );
    await this.markShoppingCartProductAsDeleted(shoppingCartProduct);

    return {
      result: this.localizationService.translate('core.success'),
    };
  }

  public async getShoppingCartElements(
    filter: GetShoppingPriceDto,
    session: ECUserSession,
  ): Promise<FormatShoppingCartProductOutputDto[]> {
    const shoppingCarts = await this.findAll(
      { shoppingCartId: filter.shoppingCartId },
      session,
    );

    if (shoppingCarts.length === 0) return [];

    const shoppingCart = shoppingCarts[0];
    let shoppingCartProducts = this.filterAvailableProducts(
      shoppingCart.shoppingProducts,
    );

    if (isNotNullOrEmpty(filter.couponCode)) {
      const result = await this.applyDiscountCoupon(
        shoppingCartProducts,
        filter.couponCode,
      );
      shoppingCartProducts = result.shoppingCartProducts;
    }

    return this.formatShoppingProducts(shoppingCartProducts);
  }

  // ==================== PRIVATE METHODS ====================

  private async findActiveShoppingCarts(
    filter: GetShoppingCartDto,
    session: ECUserSession,
  ): Promise<ECShoppingCart[]> {
    return this.shoppingCartRepository.findAll(
      new QueryOptionsBuilder()
        .include(this.getShoppingCartIncludes())
        .filter({ sessionId: session.id })
        .filter(this.notDeletedFilter())
        .filter(this.notPurchasedFilter())
        .filterIf(filter.vendorId != null, { vendorId: filter.vendorId })
        .filterIf(filter.shoppingCartId != null, { id: filter.shoppingCartId })
        .build(),
    );
  }

  private getShoppingCartIncludes() {
    return [
      {
        model: ECShoppingCartProduct,
        as: 'shoppingCartProducts',
        where: { isDeleted: { [Op.is]: null } },
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
    ];
  }

  private notDeletedFilter() {
    return Sequelize.where(
      Sequelize.fn('isnull', Sequelize.col('ECShoppingCart.isDeleted'), 0),
      { [Op.eq]: 0 },
    );
  }

  private notPurchasedFilter() {
    return Sequelize.where(
      Sequelize.fn('isnull', Sequelize.col('ECShoppingCart.isPurchase'), 0),
      { [Op.eq]: 0 },
    );
  }

  private async mapShoppingCartsToDto(
    shoppingCarts: ECShoppingCart[],
  ): Promise<ShoppingCartDto[]> {
    return Promise.all(
      shoppingCarts.map(async (cart) => ({
        id: cart.id,
        sessionId: cart.sessionId,
        shippingWayId: cart.shippingWayId,
        expire: cart.expire,
        vendorId: cart.vendorId,
        vendor: {
          id: cart.vendor?.id,
          title: cart.vendor?.name,
          slug: cart.vendor?.slug,
          latitude: cart.vendor?.latitude,
          longitude: cart.vendor?.longitude,
        },
        shoppingProducts: await this.mapShoppingCartProducts(
          cart.shoppingCartProducts,
        ),
      })),
    );
  }

  private async mapShoppingCartProducts(
    products: ECShoppingCartProduct[],
  ): Promise<ShoppingCartProductDto[]> {
    // Build unique product-inventory pairs for bulk fetching
    const uniqueKey = (p: { productId: any; inventoryId: any }) =>
      `${p.productId}_${p.inventoryId}`;
    const pairMap: Record<string, { productId: number; inventoryId: number }> =
      {};
    for (const sp of products) {
      const key = uniqueKey({
        productId: sp.productId,
        inventoryId: sp.inventoryId,
      });
      if (!pairMap[key]) {
        pairMap[key] = {
          productId: Number(sp.productId),
          inventoryId: Number(sp.inventoryId),
        };
      }
    }
    const productInventoryPairs = Object.values(pairMap);

    if (productInventoryPairs.length === 0) return [];

    // Query all products in one shot with their requested inventories
    const filter = _.extend(_.cloneDeep(this.emptyListFilter), {
      productInventoryPairs,
      limit: productInventoryPairs.length,
      offset: 0,
    });
    const productsQuery = await this.productRepositoryService.findAll(
      filter as any,
    );
    const repoProducts = productsQuery.result || [];

    // Index by productId
    const productById = new Map<number, any>();
    for (const p of repoProducts) {
      productById.set(Number(p.id), p);
    }

    // Map back to shopping cart products
    const result: ShoppingCartProductDto[] = [];
    for (const sp of products) {
      const repoProduct = productById.get(Number(sp.productId));
      let productObj: any;
      if (repoProduct) {
        // Clone to avoid shared mutation and keep only the specific inventory
        const productPlain = JSON.parse(JSON.stringify(repoProduct));
        const matchedInventory = (productPlain.inventories || []).find(
          (inv: any) => Number(inv.id) === Number(sp.inventoryId),
        );
        productPlain.inventories = matchedInventory ? [matchedInventory] : [];
        productObj = productPlain;
      } else {
        // Fallback object to ensure downstream checks work and trigger cleanup
        productObj = {
          inventoryStatusId: InventoryStatusEnum.unavailable,
          inventories: [{ qty: 0 }],
        };
      }

      if (this.isProductUnavailable(productObj, sp.qty)) {
        await this.scheduleProductRemoval(sp);
      }

      result.push({
        id: sp.id,
        shoppingCartId: sp.shoppingCartId,
        productId: sp.productId,
        qty: sp.qty,
        inventoryId: sp.inventoryId,
        product: productObj,
      });
    }
    return result;
  }

  private isProductUnavailable(product: any, quantity: number): boolean {
    return (
      product.inventoryStatusId === InventoryStatusEnum.unavailable ||
      product.inventories[0].qty < quantity
    );
  }

  private async scheduleProductRemoval(product: ECShoppingCartProduct) {
    await this.shoppingCartProductRemoveQueue.add(
      SHOPPING_CART_PRODUCT_REMOVE_JOB,
      {
        shoppingCartId: product.shoppingCartId,
        shoppingCartProductId: product.id,
      },
    );
  }

  private filterAvailableProducts(products: ShoppingCartProductDto[]) {
    return products.filter(
      (product) =>
        product.product.inventoryStatusId === InventoryStatusEnum.available &&
        product.product.inventories[0].qty >= product.qty,
    );
  }

  public calculatePriceSummary(items: FormatShoppingCartProductOutputDto[]) {
    return {
      totalPrice: sumProperty(items, 'totalPrice'),
      totalDiscount: sumProperty(items, 'discountFee'),
      totalProductPrice: sumProperty(items, 'totalProductPrice'),
    };
  }

  private hasValidLocation(filter: GetShoppingPriceDto): boolean {
    return (
      isNotNullOrEmpty(filter.latitude) && isNotNullOrEmpty(filter.longitude)
    );
  }

  private async calculateShippingCost(
    vendorId: number,
    latitude: string,
    longitude: string,
  ) {
    const vendor = await this.getVendorWithDistance(
      vendorId,
      latitude,
      longitude,
    );
    const vendorDistanceInMeters = vendor['distanceInMeters'] as number;

    if (vendorDistanceInMeters > this.distanceMeters) {
      return { allowProcess: false, totalShipmentPrice: 0 };
    }

    const [basePrice, pricePerKm] = await Promise.all([
      this.getSettingValue(CourierPriceEnum.BASE_COURIER_PRICE),
      this.getSettingValue(CourierPriceEnum.COURIER_PRICE_BY_KILOMETRE),
    ]);

    const km = Math.round(vendorDistanceInMeters / 1000);
    const totalShipmentPrice = Number(basePrice) + km * Number(pricePerKm);

    return { allowProcess: true, totalShipmentPrice };
  }

  private async getVendorWithDistance(
    vendorId: number,
    latitude: string,
    longitude: string,
  ) {
    const vendors = await this.sequelize.query(
      `SELECT 
        id, 
        name, 
        coordinates.STDistance(geography::Point(:latitude, :longitude, 4326)) AS distanceInMeters
       FROM ECVendors
       WHERE id = :vendorId`,
      {
        replacements: { latitude, longitude, vendorId },
        type: QueryTypes.SELECT,
      },
    );
    return vendors[0];
  }

  private async getSettingValue(key: string): Promise<string> {
    const setting = await this.settingRepository.findOne(
      new QueryOptionsBuilder().filter({ key }).build(),
    );
    return setting.value;
  }

  private async applyDiscountCoupon(
    shoppingCartProducts: ShoppingCartProductDto[],
    couponCode: string,
  ) {
    const discount =
      await this.applyDiscountService.findDiscountByCouponCode(couponCode);
    if (!discount) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.cannot_find_discount_coupon',
        ),
      );
    }
    return this.applyCouponToProducts(shoppingCartProducts, discount);
  }

  private async applyCouponToProducts(
    shoppingCartProducts: ShoppingCartProductDto[],
    discount: ECDiscount,
  ) {
    await this.validateCouponAvailability(discount);

    const results = await Promise.all(
      shoppingCartProducts.map((product) =>
        this.applyCouponToProduct(product, discount),
      ),
    );

    const shoppingCartProductsEdited = results.map(
      (r) => r.shoppingCartProduct,
    );
    const appliedItem = results.reduce((sum, r) => sum + r.countApllied, 0);

    this.validateCouponApplication(appliedItem, discount);

    return {
      shoppingCartProducts: shoppingCartProductsEdited,
      discount,
      countApplied: appliedItem,
    };
  }

  private async validateCouponAvailability(discount: ECDiscount) {
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
  }

  private validateCouponApplication(appliedItem: number, discount: ECDiscount) {
    if (appliedItem === 0) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.cannot_find_any_coupon_code_for_this_selected_product',
        ),
      );
    }

    const available =
      defaultValueIsNull(discount.limit, 0) -
      defaultValueIsNull(discount.used, 0);
    if (appliedItem > available && discount.limit != null) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_maximum_of_used_this_coupon_code_reach',
        ),
      );
    }
  }

  private async applyCouponToProduct(
    shoppingCartProduct: ShoppingCartProductDto,
    discount: ECDiscount,
  ) {
    const { inventory, applied } =
      await this.applyDiscountService._applyCopunCodeToInventory(
        shoppingCartProduct.product,
        shoppingCartProduct.product.inventories[0],
        discount,
      );

    if (applied) {
      shoppingCartProduct.product.inventories[0] = inventory;
      return {
        shoppingCartProduct,
        countApllied: shoppingCartProduct.qty,
      };
    }

    return {
      shoppingCartProduct,
      countApllied: 0,
    };
  }

  private async formatShoppingProducts(
    shoppingCartProducts: ShoppingCartProductDto[],
  ): Promise<FormatShoppingCartProductOutputDto[]> {
    return Promise.all(
      shoppingCartProducts.map((product) =>
        this.formatShoppingProduct(product),
      ),
    );
  }

  private formatShoppingProduct(
    product: ShoppingCartProductDto,
  ): FormatShoppingCartProductOutputDto {
    const inventoryPrice = product.product.inventories[0].firstPrice;

    const basePrice = Number(inventoryPrice.price);
    const afterDiscount = Number(
      inventoryPrice?.appliedDiscount?.newPrice ?? basePrice,
    );
    const discountFeePerItem = basePrice - afterDiscount;

    return {
      shoppingCartId: product.shoppingCartId,
      shoppingCartProductId: product.id,
      productId: product.productId,
      inventoryId: product.inventoryId,
      basePrice,
      qty: product.qty,
      discountId: inventoryPrice?.appliedDiscount?.id,
      inventoryPriceId: inventoryPrice.id,
      variationPriceId: inventoryPrice.variationPriceId,
      vendorId: product.product.inventories[0].vendorId,
      afterDiscount,
      discountFeePerItem,
      discountFee: discountFeePerItem * product.qty,
      totalProductPrice: basePrice * product.qty,
      totalPrice: afterDiscount * product.qty,
    };
  }

  private async validateInventory(inventoryId: bigint): Promise<ECInventory> {
    const inventory = await this.inventoryService.findById(inventoryId);
    if (!inventory) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_inventory_isnt_available',
        ),
      );
    }
    return inventory;
  }

  private async findOrCreateShoppingCart(
    inventory: ECInventory,
    session: ECUserSession,
  ): Promise<ECShoppingCart> {
    const shoppingCart = await this.findCurrentlyShoppingCart(
      inventory,
      session,
    );
    return shoppingCart || this.createShoppingCart(inventory, session);
  }

  private async upsertProductInCart(
    shoppingCart: ECShoppingCart,
    inventory: ECInventory,
    product: AddProductShoppingCartDto,
  ) {
    const currentProduct = await this.findProductInShoppingCart(
      shoppingCart,
      inventory.productId,
      inventory.id,
    );

    if (currentProduct) {
      product.qty += currentProduct.qty;
    }

    this.validateProductQuantity(product.qty, inventory.qty);

    if (product.qty <= 0) {
      if (currentProduct) {
        await this.removeShoppingCartProductById(currentProduct.id);
      }
      return;
    }

    if (currentProduct) {
      currentProduct.qty = product.qty;
      await currentProduct.save();
    } else {
      await this.createShoppingCartProduct(shoppingCart, inventory, product);
    }
  }

  private validateProductQuantity(requestedQty: number, availableQty: number) {
    if (requestedQty > availableQty) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_inventory_isnt_available',
        ),
      );
    }
  }

  private async findActiveShoppingCartById(
    session: ECUserSession,
    shoppingCartId: bigint,
  ): Promise<ECShoppingCart> {
    const shoppingCart = await this.shoppingCartRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: shoppingCartId })
        .filter({ sessionId: session.id })
        .filter(this.notDeletedFilter())
        .filter(this.notPurchasedFilter())
        .build(),
    );

    if (!shoppingCart) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.shipping_card_is_not_founded',
        ),
      );
    }

    return shoppingCart;
  }

  private async markShoppingCartAsDeleted(shoppingCart: ECShoppingCart) {
    shoppingCart.isDeleted = true;
    await shoppingCart.save();
  }

  private async findActiveShoppingCartProduct(
    session: ECUserSession,
    shoppingCartProductId: bigint,
  ): Promise<ECShoppingCartProduct> {
    const shoppingCartProduct =
      await this.shoppingCartProductRepository.findOne(
        new QueryOptionsBuilder()
          .include([
            {
              model: ECShoppingCart,
              as: 'shoppingCart',
              required: true,
              where: { sessionId: session.id },
            },
          ])
          .filter({ id: shoppingCartProductId })
          .filter(this.notDeletedShoppingCartProductFilter())
          .build(),
      );

    if (!shoppingCartProduct) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.shipping_card_product_is_not_founded',
        ),
      );
    }

    return shoppingCartProduct;
  }

  private notDeletedShoppingCartProductFilter() {
    return Sequelize.where(
      Sequelize.fn(
        'isnull',
        Sequelize.col('ECShoppingCartProduct.isDeleted'),
        0,
      ),
      { [Op.eq]: 0 },
    );
  }

  private async markShoppingCartProductAsDeleted(
    shoppingCartProduct: ECShoppingCartProduct,
  ) {
    shoppingCartProduct.isDeleted = true;
    await shoppingCartProduct.save();
  }

  private async createShoppingCartProduct(
    shoppingCart: ECShoppingCart,
    inventory: ECInventory,
    product: AddProductShoppingCartDto,
  ): Promise<ECShoppingCartProduct> {
    return this.shoppingCartProductRepository.create({
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
    return this.shoppingCartProductRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ shoppingCartId: shoppingCart.id })
        .filter({ productId })
        .filter({ inventoryId })
        .filter(this.notDeletedShoppingCartProductFilter())
        .build(),
    );
  }

  private async createShoppingCart(
    inventory: ECInventory,
    session: ECUserSession,
  ): Promise<ECShoppingCart> {
    const increase = this.config.get<number>('STOCK_EXPIRE_DAY') || 2;

    return this.shoppingCartRepository.create({
      vendorId: inventory.vendorId,
      shippingWayId: inventory.product.entityType.shippingWayId,
      expire: addDays(new Date(), increase),
      sessionId: session.id,
    });
  }

  private async findCurrentlyShoppingCart(
    inventory: ECInventory,
    session: ECUserSession,
  ): Promise<ECShoppingCart> {
    return this.shoppingCartRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ shippingWayId: inventory.product.entityType.shippingWayId })
        .filter({ vendorId: inventory.vendorId })
        .filter({ sessionId: session.id })
        .filter(this.notDeletedFilter())
        .filter(this.notPurchasedFilter())
        .filter({ expire: { [Op.gt]: Sequelize.fn('getdate') } })
        .build(),
    );
  }

  private async removeShoppingCartProductById(shoppingCartProductId: bigint) {
    const shoppingCartProduct =
      await this.shoppingCartProductRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: shoppingCartProductId })
          .filter(this.notDeletedShoppingCartProductFilter())
          .build(),
      );

    if (shoppingCartProduct) {
      shoppingCartProduct.isDeleted = true;
      await shoppingCartProduct.save();
    }
  }
}
