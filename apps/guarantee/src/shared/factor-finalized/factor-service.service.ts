import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import {
  GSAssignedGuarantee,
  GSAssignedGuaranteeAdditionalPackage,
  GSFactor,
  GSFactorAdditionalPackage,
  GSFactorVipBundle,
  GSGuarantee,
  GSVipBundleType,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSFactorStatusEnum } from '../factor-status';
import { GSFactorTypeEnum } from '../factor-type';
import { Op, Sequelize, Transaction } from 'sequelize';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { GuaranteeTraverseService } from '@rahino/guarantee/cartable/guarantee-traverse/guarantee-traverse.service';
import { GuaranteeTraverseDto } from '../guarantee-traverse';
import { User } from '@rahino/database';
import * as ShortUniqueId from 'short-unique-id';
import * as moment from 'moment';
import { GSProviderEnum } from '../provider';
import { GSGuaranteeTypeEnum } from '../gurantee-type';
import { GSGuaranteeConfirmStatus } from '../guarantee-confirm-status';

@Injectable()
export class FactorFinalizedService {
  constructor(
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,
    @InjectModel(GSFactorAdditionalPackage)
    private readonly factorAdditionalPackageRepository: typeof GSFactorAdditionalPackage,
    @InjectModel(GSAssignedGuaranteeAdditionalPackage)
    private readonly assignedGuaranteeAdditionalPackageRepository: typeof GSAssignedGuaranteeAdditionalPackage,
    @InjectModel(GSAssignedGuarantee)
    private readonly assignedGuaranteeRepository: typeof GSAssignedGuarantee,
    @InjectModel(GSFactorVipBundle)
    private readonly factorVipBundleRepository: typeof GSFactorVipBundle,
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepository: typeof GSGuarantee,
    private readonly traverseService: TraverseService,

    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
  ) {}

  async finalized(user: User, factorId: bigint) {
    let factor = await this.factorRepository.findOne(
      new QueryOptionsBuilder().filter({ id: factorId }).build(),
    );

    const factorStrategies = {
      [GSFactorTypeEnum.PayRequestFactor]: () => this.traverse(user, factor),
      [GSFactorTypeEnum.BuyAdditionalPackage]: () =>
        this.additionalPackageToGuarantee(factor),
      [GSFactorTypeEnum.BuyVipCard]: () => this.generateVipCard(factor),
    };

    const strategy = factorStrategies[factor.factorTypeId];
    if (!strategy) {
      throw new BadRequestException('invalid factor strategy');
    }

    await strategy();

    factor.factorStatusId = GSFactorStatusEnum.Paid;
    factor.settlementDate = new Date();
    await factor.save();
  }

  async generateVipCard(factor: GSFactor) {
    const factorVipBundle = await this.factorVipBundleRepository.findOne(
      new QueryOptionsBuilder()
        .include({ model: GSVipBundleType, as: 'vipBundleType' })
        .filter({ factorId: factor.id })
        .build(),
    );

    const uid = new ShortUniqueId({ length: 10 });
    const currentDate = new Date();
    const momentEndDate = moment(currentDate).add(
      factorVipBundle.vipBundleType.monthPeriod,
      'M',
    );
    const endDate = momentEndDate.toDate();

    const randomSerialNumber = uid.rnd();
    const guarantee = await GSGuarantee.create({
      providerId: GSProviderEnum.ARIAKISH_LOCAL,
      guaranteeTypeId: GSGuaranteeTypeEnum.VIP,
      guaranteeConfirmStatusId: GSGuaranteeConfirmStatus.Confirm,
      serialNumber: randomSerialNumber,
      startDate: currentDate,
      endDate: endDate,
      vipBundleTypeId: factorVipBundle.vipBundleTypeId,
      totalCredit: factorVipBundle.fee,
      availableCredit: factorVipBundle.fee,
    });

    await this.assignedGuaranteeRepository.create({
      guaranteeId: guarantee.id,
      userId: factor.userId,
    });
  }

  private async additionalPackageToGuarantee(factor: GSFactor) {
    const assignedGuarantee = await this.assignedGuaranteeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ guaranteeId: factor.guaranteeId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSAssignedGuarantee.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    const factorAdditionalPackages =
      await this.factorAdditionalPackageRepository.findAll(
        new QueryOptionsBuilder().filter({ factorId: factor.id }).build(),
      );

    for (const factorAdditionalPackage of factorAdditionalPackages) {
      await this.assignedGuaranteeAdditionalPackageRepository.create({
        assignedGuaranteeId: assignedGuarantee.id,
        additionalPackageId: factorAdditionalPackage.additionalPackageId,
      });
    }
  }

  private async traverse(user: User, factor: GSFactor) {
    let dto = new GuaranteeTraverseDto();
    dto.isClientSideCartable = true;
    dto.nodeCommandId = factor.traverseNodeCommandId;
    dto.requestId = factor.traverseRequestId;
    dto.nodeId = factor.traverseNodeId;
    dto.requestStateId = factor.traverseRequestStateId;

    dto.isClientSideCartable = true;
    const cartableItem =
      await this.guaranteeTraverseService.validateAndReturnCartableItem(
        user,
        dto,
      );

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      await this.traverseService.traverse({
        node: cartableItem.node,
        nodeCommand: cartableItem.nodeCommand,
        request: cartableItem.request,
        requestState: cartableItem.requestState,
        userExecuterId: factor.userId,
        transaction: transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
}
