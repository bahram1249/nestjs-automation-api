import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { GetOrderDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { OrderStatusEnum } from '@rahino/ecommerce/util/enum';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
import { UserVendorService } from '@rahino/ecommerce/user/vendor/user-vendor.service';
import { ECOrderDetailStatus } from '@rahino/database/models/ecommerce-eav/ec-order-detail-status.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(ECOrder)
    private readonly repository: typeof ECOrder,
    private readonly userVendorService: UserVendorService,
  ) {}

  async findAll(user: User, filter: GetOrderDto) {
    const isAccess = await this.userVendorService.isAccessToVendor(
      user,
      filter.vendorId,
    );
    if (!isAccess) {
      throw new ForbiddenException('cannot find access to this vendor');
    }

    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({
        orderStatusId: {
          [Op.ne]: OrderStatusEnum.WaitingForPayment,
        },
      })
      .filter(
        Sequelize.literal(`is exists (
        SELECT 1
        FROM ECOrderDetails EOD
        WHERE EDO.orderId = ECOrder.id AND EDO.vendorId = ${filter.vendorId}
      )`),
      );

    const count = await this.repository.count(queryBuilder.build());
    queryBuilder = queryBuilder.include([
      {
        include: [
          {
            model: ECVendor,
            as: 'vendor',
          },
          {
            model: ECOrderDetailStatus,
            as: 'orderDetailStatus',
          },
          {
            attributes: ['id', 'title', 'slug'],
            model: ECProduct,
            as: 'product',
          },
          {
            attributes: ['id', 'name'],
            model: ECDiscount,
            as: 'discount',
          },
        ],
        model: ECOrderDetail,
        as: 'details',
        where: {
          [Op.and]: [
            {
              vendorId: filter.vendorId,
            },
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('details.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          ],
        },
      },
      {
        attributes: ['id', 'firstname', 'lastname', 'username', 'phoneNumber'],
        model: User,
        as: 'user',
      },
      {
        model: ECAddress,
        as: 'address',
      },
    ]);
    return {
      result: queryBuilder.build(),
      total: count,
    };
  }

  async findById(id: bigint, user: User, filter: GetOrderDto) {
    const isAccess = await this.userVendorService.isAccessToVendor(
      user,
      filter.vendorId,
    );
    if (!isAccess) {
      throw new ForbiddenException('cannot find access to this vendor');
    }

    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({
        orderStatusId: {
          [Op.ne]: OrderStatusEnum.WaitingForPayment,
        },
      })
      .filter(
        Sequelize.literal(`is exists (
        SELECT 1
        FROM ECOrderDetails EOD
        WHERE EDO.orderId = ECOrder.id AND EDO.vendorId = ${filter.vendorId}
      )`),
      )
      .filter({ id: id });

    const count = await this.repository.count(queryBuilder.build());
    queryBuilder = queryBuilder.include([
      {
        include: [
          {
            model: ECVendor,
            as: 'vendor',
          },
          {
            model: ECOrderDetailStatus,
            as: 'orderDetailStatus',
          },
          {
            attributes: ['id', 'title', 'slug'],
            model: ECProduct,
            as: 'product',
          },
          {
            attributes: ['id', 'name'],
            model: ECDiscount,
            as: 'discount',
          },
        ],
        model: ECOrderDetail,
        as: 'details',
        where: {
          [Op.and]: [
            {
              vendorId: filter.vendorId,
            },
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('details.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          ],
        },
      },
      {
        attributes: ['id', 'firstname', 'lastname', 'username', 'phoneNumber'],
        model: User,
        as: 'user',
      },
      {
        model: ECAddress,
        as: 'address',
      },
    ]);
    return {
      result: queryBuilder.build(),
      total: count,
    };
  }
}
