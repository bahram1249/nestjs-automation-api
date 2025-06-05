import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ECInventory,
  ECShippingWay,
  ECShoppingCart,
  ECShoppingCartProduct,
  ECUserSession,
  ECVendor,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import {
  AddProductShoppingCartDto,
  GetShoppingCartDto,
  RemoveShoppingCartDto,
  RemoveShoppingCartProductDto,
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
import { addDays } from '@rahino/commontools';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';
import { InjectQueue } from '@nestjs/bullmq';
import {
  SHOPPING_CART_PRODUCT_REMOVE_JOB,
  SHOPPING_CART_PRODUCT_REMOVE_QUEUE,
} from './constants';
import { Queue } from 'bullmq';
@Injectable()
export class ShoppingCartService {
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
              isDeleted: true,
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

  async addProduct(
    session: ECUserSession,
    product: AddProductShoppingCartDto,
  ): Promise<ShoppingCartDto[]> {
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
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.the_inventory_isnt_available',
        ),
      );
    }

    if (currentProduct) {
      currentProduct.qty = product.qty;
      await currentProduct.save();
    } else {
      await this.createShoppingCartProduct(shoppingCart, inventory, product);
    }

    return await this.findAll({ shoppingCartId: shoppingCart.id }, session);
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
