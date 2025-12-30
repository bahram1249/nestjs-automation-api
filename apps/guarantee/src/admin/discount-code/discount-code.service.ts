import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  GetDiscountCodeDto,
  DiscountCodeDto,
  ValidateDiscountCodeDto,
  DiscountCodePreviewDto,
} from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSDiscountCode, GSUnitPrice } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class DiscountCodeService {
  constructor(
    @InjectModel(GSDiscountCode)
    private readonly repository: typeof GSDiscountCode,
    private readonly localizationService: LocalizationService,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetDiscountCodeDto) {
    let query = new QueryOptionsBuilder()
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSDiscountCode.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'code',
        'title',
        'discountType',
        'discountValue',
        'unitPriceId',
        'totalUsageLimit',
        'perUserUsageLimit',
        'maxDiscountAmount',
        'validFrom',
        'validUntil',
        'isActive',
        'organizationId',
        'description',
        'createdAt',
        'updatedAt',
      ])
      .include([{ model: GSUnitPrice, as: 'unitPrice' }])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }

  async findById(entityId: bigint) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'code',
          'title',
          'discountType',
          'discountValue',
          'unitPriceId',
          'totalUsageLimit',
          'perUserUsageLimit',
          'maxDiscountAmount',
          'validFrom',
          'validUntil',
          'isActive',
          'organizationId',
          'description',
          'createdAt',
          'updatedAt',
        ])
        .include([{ model: GSUnitPrice, as: 'unitPrice' }])
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSDiscountCode.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: entityId })
        .build(),
    );

    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    return {
      result: item,
    };
  }

  async create(dto: DiscountCodeDto) {
    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'code',
          'title',
          'discountType',
          'discountValue',
          'unitPriceId',
          'totalUsageLimit',
          'perUserUsageLimit',
          'maxDiscountAmount',
          'validFrom',
          'validUntil',
          'isActive',
          'organizationId',
          'description',
          'createdAt',
          'updatedAt',
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSDiscountCode.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ code: dto.code })
        .build(),
    );

    if (duplicateItem) {
      throw new BadRequestException(
        this.localizationService.translate('core.item_exists'),
      );
    }

    const mappedItem = this.mapper.map(dto, DiscountCodeDto, GSDiscountCode);
    const insertedItem = _.omit(mappedItem.toJSON(), ['id']);

    const result = await this.repository.create(insertedItem);

    return {
      result: result,
    };
  }

  async updateById(id: bigint, dto: DiscountCodeDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'code',
          'title',
          'discountType',
          'discountValue',
          'unitPriceId',
          'totalUsageLimit',
          'perUserUsageLimit',
          'maxDiscountAmount',
          'validFrom',
          'validUntil',
          'isActive',
          'organizationId',
          'description',
          'createdAt',
          'updatedAt',
        ])
        .include([{ model: GSUnitPrice, as: 'unitPrice' }])
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSDiscountCode.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: id })
        .build(),
    );

    if (!item) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSDiscountCode.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ code: dto.code })
        .filter({
          id: {
            [Op.ne]: id,
          },
        })
        .build(),
    );

    if (duplicateItem) {
      throw new BadRequestException(
        this.localizationService.translate('core.item_exists'),
      );
    }

    const mappedItem = this.mapper.map(dto, DiscountCodeDto, GSDiscountCode);
    const updatedItem = _.omit(mappedItem.toJSON(), ['id']);

    await this.repository.update(updatedItem, { where: { id } });

    return await this.findById(id);
  }

  async deleteById(entityId: bigint) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSDiscountCode.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: entityId })
        .build(),
    );

    if (!item) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    item.isDeleted = true;
    await item.save();

    return {
      result: _.pick(item, [
        'id',
        'code',
        'title',
        'discountType',
        'discountValue',
        'totalUsageLimit',
        'perUserUsageLimit',
        'maxDiscountAmount',
        'validFrom',
        'validUntil',
        'isActive',
        'organizationId',
        'description',
        'createdAt',
        'updatedAt',
      ]),
    };
  }

  // async validateAndUseDiscountCode(
  //   code: string,
  //   guaranteeId: bigint,
  //   originalAmount: bigint,
  //   factorId?: bigint,
  //   transaction?: Transaction,
  // ): Promise<{
  //   discountCode: GSDiscountCode;
  //   discountAmount: bigint;
  //   finalAmount: bigint;
  // }> {
  //   const discountCode = await this.repository.findOne({
  //     where: { code, isActive: true, isDeleted: false },
  //   });

  //   if (!discountCode) {
  //     throw new BadRequestException('Invalid discount code');
  //   }

  //   const now = new Date();
  //   if (now < discountCode.validFrom || now > discountCode.validUntil) {
  //     throw new BadRequestException('Discount code has expired');
  //   }

  //   const totalUsageCount = await this.usageRepository.count({
  //     where: { discountCodeId: discountCode.id },
  //   });

  //   if (totalUsageCount >= discountCode.totalUsageLimit) {
  //     throw new BadRequestException('Discount code usage limit reached');
  //   }

  //   const userUsageCount = await this.usageRepository.count({
  //     where: { discountCodeId: discountCode.id, guaranteeId },
  //   });

  //   if (userUsageCount >= discountCode.perUserUsageLimit) {
  //     throw new BadRequestException(
  //       'You have reached the maximum usage limit for this discount code',
  //     );
  //   }

  //   let discountAmount: bigint;
  //   if (discountCode.discountType === 'percentage') {
  //     discountAmount =
  //       (originalAmount *
  //         BigInt(Math.round(discountCode.discountValue * 100))) /
  //       10000n;
  //   } else {
  //     discountAmount = BigInt(discountCode.discountValue);
  //   }

  //   if (discountAmount > discountCode.maxDiscountAmount) {
  //     discountAmount = discountCode.maxDiscountAmount;
  //   }

  //   const finalAmount = originalAmount - discountAmount;

  //   await this.usageRepository.create(
  //     {
  //       discountCodeId: discountCode.id,
  //       guaranteeId,
  //       factorId,
  //       originalAmount,
  //       discountAmount,
  //       finalAmount,
  //     },
  //     { transaction },
  //   );

  //   return {
  //     discountCode,
  //     discountAmount,
  //     finalAmount,
  //   };
  // }

  // async validateDiscountCodeForVipBundle(
  //   dto: ValidateDiscountCodeDto,
  // ): Promise<DiscountCodePreviewDto> {
  //   const vipBundleType = await this.vipBundleTypeRepository.findOne({
  //     where: { id: dto.vipBundleTypeId },
  //   });

  //   if (!vipBundleType) {
  //     throw new BadRequestException('VIP bundle type not found');
  //   }

  //   if (!dto.discountCode) {
  //     return {
  //       originalPrice: vipBundleType.price,
  //       finalPrice: vipBundleType.price,
  //     };
  //   }

  //   const discountCode = await this.repository.findOne({
  //     where: { code: dto.discountCode, isActive: true, isDeleted: false },
  //   });

  //   if (!discountCode) {
  //     throw new BadRequestException('Invalid discount code');
  //   }

  //   const now = new Date();
  //   if (now < discountCode.validFrom || now > discountCode.validUntil) {
  //     throw new BadRequestException('Discount code has expired');
  //   }

  //   let discountAmount: bigint;
  //   if (discountCode.discountType === 'percentage') {
  //     discountAmount =
  //       (vipBundleType.price *
  //         BigInt(Math.round(discountCode.discountValue * 100))) /
  //       10000n;
  //   } else {
  //     discountAmount = BigInt(discountCode.discountValue);
  //   }

  //   if (discountAmount > discountCode.maxDiscountAmount) {
  //     discountAmount = discountCode.maxDiscountAmount;
  //   }

  //   const finalPrice = vipBundleType.price - discountAmount;
  //   const finalFinalPrice = finalPrice < 0n ? 0n : finalPrice;

  //   return {
  //     originalPrice: vipBundleType.price,
  //     discountAmount,
  //     finalPrice: finalFinalPrice,
  //     discountCodeTitle: discountCode.title,
  //   };
  // }
}
