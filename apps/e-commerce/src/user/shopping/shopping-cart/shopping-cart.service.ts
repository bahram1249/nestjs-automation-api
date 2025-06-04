import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ECShippingWay,
  ECShoppingCart,
  ECShoppingCartProduct,
  ECUserSession,
  ECVendor,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { GetShoppingCartDto, ShoppingCartDto } from './dto';
import { ShoppingCartProductDto } from './dto/shopping-cart-product.dto';
import { ListFilter } from '@rahino/query-filter';
import { emptyListFilter } from '@rahino/query-filter/provider/constants';
import * as _ from 'lodash';
import { ProductRepositoryService } from '@rahino/ecommerce/product/service/product-repository.service';
@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ECShoppingCart)
    private readonly shoppingCartRepository: typeof ECShoppingCart,
    @Inject(emptyListFilter)
    private readonly emptyListFilter: ListFilter,
    private readonly productRepositoryService: ProductRepositoryService,
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
            attributes: ['id', 'name', 'slug'],
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
          shoppingCartId: filter.shoppingCartId,
        })
        .build(),
    );
    return await this.mappingShoppingCart(shoppingCarts);
  }

  async mappingShoppingCart(
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
            lat: '',
            long: '',
          },
          shoppingProducts,
        };
      },
    );

    return Promise.all(mappedCarts);
  }

  async mappingShoppingCartProduct(
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
