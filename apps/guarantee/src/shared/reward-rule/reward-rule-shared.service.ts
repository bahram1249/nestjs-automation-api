import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSRewardRule,
  GSVipBundleType,
  GSAssignedGuarantee,
  GSGuarantee,
  GSRewardHistory,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { User } from '@rahino/database';
import * as ShortUniqueId from 'short-unique-id';
import * as moment from 'moment';
import { GSProviderEnum } from '../provider';
import { GSGuaranteeTypeEnum } from '../gurantee-type';
import { GSGuaranteeConfirmStatus } from '../guarantee-confirm-status';
import { RialPriceService } from '../rial-price';

@Injectable()
export class GSRewardRuleSharedService {
  constructor(
    @InjectModel(GSRewardRule)
    private readonly rewardRuleRepository: typeof GSRewardRule,
    @InjectModel(GSVipBundleType)
    private readonly vipBundleTypeRepository: typeof GSVipBundleType,
    @InjectModel(GSAssignedGuarantee)
    private readonly assignedGuaranteeRepository: typeof GSAssignedGuarantee,
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepository: typeof GSGuarantee,
    @InjectModel(GSRewardHistory)
    private readonly rewardHistoryRepository: typeof GSRewardHistory,
    private readonly rialPriceService: RialPriceService,
  ) {}

  async checkAndGrantReward(
    user: User,
    guarantee: GSGuarantee,
  ): Promise<GSAssignedGuarantee | undefined> {
    const rewardRule = await this.findActiveRewardRule();

    if (!rewardRule) {
      return;
    }

    return await this.generateVipCardForUser(user, rewardRule, guarantee);
  }

  private async findActiveRewardRule(): Promise<GSRewardRule | null> {
    const now = new Date();

    const rewardRule = await this.rewardRuleRepository.findOne({
      where: {
        isActive: true,
        [Op.or]: [
          { validFrom: null, validUntil: null },
          {
            validFrom: { [Op.lte]: now },
            validUntil: { [Op.gte]: now },
          },
        ],
      },
      include: [
        {
          model: GSVipBundleType,
          as: 'vipBundleType',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return rewardRule;
  }

  private async generateVipCardForUser(
    user: User,
    rewardRule: GSRewardRule,
    originalGuarantee: GSGuarantee,
  ): Promise<GSAssignedGuarantee> {
    const uid = new ShortUniqueId({ length: 10 });
    const currentDate = new Date();
    const momentEndDate = moment(currentDate).add(
      rewardRule.monthPeriod || 12,
      'M',
    );
    const endDate = momentEndDate.toDate();

    const randomSerialNumber = uid.rnd();

    const guarantee = await this.guaranteeRepository.create({
      providerId: GSProviderEnum.ARIAKISH_LOCAL,
      guaranteeTypeId: GSGuaranteeTypeEnum.VIP,
      guaranteeConfirmStatusId: GSGuaranteeConfirmStatus.Confirm,
      serialNumber: randomSerialNumber,
      startDate: currentDate,
      endDate: endDate,
      vipBundleTypeId: rewardRule.vipBundleTypeId,
      totalCredit: this.rialPriceService.getRialPrice({
        price: Number(rewardRule.rewardAmount),
        unitPriceId: rewardRule.unitPriceId,
      }),
      availableCredit: this.rialPriceService.getRialPrice({
        price: Number(rewardRule.rewardAmount),
        unitPriceId: rewardRule.unitPriceId,
      }),
    });

    const assignedGuarantee = await this.assignedGuaranteeRepository.create({
      guaranteeId: guarantee.id,
      userId: user.id,
    });

    await this.rewardHistoryRepository.create({
      userId: user.id,
      guaranteeId: originalGuarantee.id,
      rewardRuleId: rewardRule.id,
      rewardGuaranteeId: guarantee.id,
      unitPriceId: rewardRule.unitPriceId,
      originalGuaranteeSerialNumber: originalGuarantee.serialNumber,
      rewardAmount: this.rialPriceService.getRialPrice({
        price: Number(rewardRule.rewardAmount),
        unitPriceId: rewardRule.unitPriceId,
      }),
      rewardDate: currentDate,
    });

    return assignedGuarantee;
  }
}
