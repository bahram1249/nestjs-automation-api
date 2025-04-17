import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
  GSAssignedGuarantee,
  GSAssignedGuaranteeAdditionalPackage,
  GSFactor,
  GSFactorAdditionalPackage,
  GSRequest,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSFactorStatusEnum } from '../factor-status';
import { GSFactorTypeEnum } from '../factor-type';
import { Op, Sequelize, Transaction } from 'sequelize';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';

@Injectable()
export class FactorFinalizedService {
  constructor(
    @InjectModel(GSFactor) private readonly factorRepository: typeof GSFactor,
    @InjectModel(GSFactorAdditionalPackage)
    private readonly factorAdditionalPackageRepository: typeof GSFactorAdditionalPackage,
    @InjectModel(GSAssignedGuaranteeAdditionalPackage)
    private readonly assignedGuaranteeAdditionalPackageRepository: typeof GSAssignedGuaranteeAdditionalPackage,
    @InjectModel(GSAssignedGuarantee)
    private readonly assignedGuaranteeRepository: typeof GSAssignedGuarantee,
    private readonly traverseService: TraverseService,
    @InjectModel(BPMNRequest)
    private readonly requestRepository: typeof BPMNRequest,
    @InjectModel(BPMNRequestState)
    private readonly requestStateRepository: typeof BPMNRequestState,
    @InjectModel(BPMNNode)
    private readonly nodeRepository: typeof BPMNNode,
    @InjectModel(BPMNNodeCommand)
    private readonly nodeCommandRepository: typeof BPMNNodeCommand,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async finalized(factorId: bigint) {
    let factor = await this.factorRepository.findOne(
      new QueryOptionsBuilder().filter({ id: factorId }).build(),
    );

    const factorStrategies = {
      [GSFactorTypeEnum.PayRequestFactor]: async () => {
        await this.traverse(factor);
      },
      [GSFactorTypeEnum.BuyAdditionalPackage]: async () => {
        await this.additionalPackageToGuarantee(factor);
      },
      [GSFactorTypeEnum.BuyVipCard]: async () => {},
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
        additionalPackageId: factorAdditionalPackage.id,
      });
    }
  }

  private async traverse(factor: GSFactor) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: factor.traverseRequestId })
        .build(),
    );
    const node = await this.nodeRepository.findOne(
      new QueryOptionsBuilder().filter({ id: factor.traverseNodeId }).build(),
    );
    const nodeCommand = await this.nodeCommandRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: factor.traverseNodeCommandId })
        .build(),
    );

    const requestState = await this.requestStateRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: factor.traverseRequestStateId })
        .build(),
    );

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      await this.traverseService.traverse({
        node: node,
        nodeCommand: nodeCommand,
        request: request,
        requestState: requestState,
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
