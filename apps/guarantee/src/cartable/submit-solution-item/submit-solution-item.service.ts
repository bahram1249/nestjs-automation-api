import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@rahino/database';
import { SubmitSolutionItemDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import {
  GSFactor,
  GSFactorService,
  GSGuaranteeOrganization,
  GSGuaranteeOrganizationContract,
  GSPaymentGateway,
  GSRequest,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { Op, Sequelize, Transaction } from 'sequelize';
import { GuaranteeTraverseService } from '../guarantee-traverse/guarantee-traverse.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { PartArrayDto } from './dto/part-array.dto';
import { SolutionArrayDto } from './dto/solution-array.dto';
import { SolutionService } from '../solution';
import { SolutionOutputDto } from '../solution/dto';
import { ValidateAndReturnCartableItemDto } from '../guarantee-traverse/dto';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';
import { GSFactorStatusEnum } from '@rahino/guarantee/shared/factor-status';
import { GSFactorTypeEnum } from '@rahino/guarantee/shared/factor-type';
import { GSServiceTypeEnum } from '@rahino/guarantee/shared/service-type';
import { GSRequestCategoryEnum } from '@rahino/guarantee/shared/request-category';
import { GSWarrantyServiceTypeEnum } from '@rahino/guarantee/shared/warranty-service-type';
import { RialPriceService } from '@rahino/guarantee/shared/rial-price';
import { GSPaymentWayEnum } from '@rahino/guarantee/shared/payment-way';
import { GSTransactionStatusEnum } from '@rahino/guarantee/shared/transaction-status';

@Injectable()
export class SubmitSolutionItemService {
  constructor(
    @InjectModel(GSRequest) private readonly repository: typeof GSRequest,
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
    private readonly solutionService: SolutionService,
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,
    @InjectModel(GSFactorService)
    private readonly factorServiceRepository: typeof GSFactorService,
    @InjectModel(GSGuaranteeOrganization)
    private readonly organization: typeof GSGuaranteeOrganization,
    private readonly rialPriceService: RialPriceService,
    @InjectModel(GSTransaction)
    private readonly transactionRepository: typeof GSTransaction,
    @InjectModel(GSPaymentGateway)
    private readonly paymentGatewayRepository: typeof GSPaymentGateway,
  ) {}

  async traverse(user: User, dto: SubmitSolutionItemDto) {
    const cartableItem =
      await this.guaranteeTraverseService.validateAndReturnCartableItem(
        user,
        dto,
      );
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const guaranteeRequest = await this.repository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: cartableItem.request.id })
          .transaction(transaction)
          .build(),
      );
      // create factor details
      const factor = await this.createFactorDetails(
        user,
        dto,
        cartableItem,
        transaction,
      );

      // create local transactions for factor
      await this.createLocalTransactionFromFactor(
        factor,
        guaranteeRequest,
        transaction,
      );

      // lets traverse request
      await this.traverseService.traverse({
        request: cartableItem.request,
        requestState: cartableItem.requestState,
        node: cartableItem.node,
        nodeCommand: cartableItem.nodeCommand,
        transaction: transaction,
        description: dto.description,
        userExecuterId: user.id,
        users: [{ userId: guaranteeRequest.technicalUserId }],
      });

      // apply changes
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
    return {
      result: {
        message: this.localizationService.translate('core.success'),
      },
    };
  }

  private async createFactorDetails(
    user: User,
    dto: SubmitSolutionItemDto,
    validateAndReturnCartableItemDto: ValidateAndReturnCartableItemDto,
    transaction: Transaction,
  ) {
    const partItems: PartArrayDto[] = dto.partItems;
    const solutionItemsDto: SolutionArrayDto[] = dto.solutionItems;

    const request = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: validateAndReturnCartableItemDto.request.id })
        .transaction(transaction)
        .build(),
    );

    const organization = await this.organization.findOne(
      new QueryOptionsBuilder()
        .include({
          model: GSGuaranteeOrganizationContract,
          as: 'organizationContracts',
          where: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('getdate'), {
                [Op.between]: [
                  Sequelize.col('GSGuaranteeOrganizationContract.startDate'),
                  Sequelize.col('GSGuaranteeOrganizationContract.endDate'),
                ],
              }),
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('GSGuaranteeOrganizationContract.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
            ],
          },
          required: false,
        })
        .filter({
          id: request.organizationId,
        })
        .transaction(transaction)
        .build(),
    );

    if (
      organization.organizationContracts == null ||
      organization.organizationContracts.length == 0
    ) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.cannot_find_any_active_contract_call_to_support',
        ),
      );
    }

    // get active contract
    const activeContract = organization.organizationContracts[0];

    // tomans
    const partTotalPrice = await this.calculatePartPrice(partItems);

    // get soulutions from database based requestId
    const solutionItems = await this.findSolutionItemsFromDatabase(
      dto.requestId,
      solutionItemsDto,
    );

    // tomans
    const solutionTotalPrice = solutionItems
      .map((solutionItem) => solutionItem.fee)
      .reduce((prev, next) => Number(prev) + Number(next), 0);

    // total price
    const totalPrice = partTotalPrice + solutionTotalPrice;

    const representativeShareOfSolutionForOrganization =
      (activeContract.representativeShare * solutionTotalPrice) / 100;

    // create factor
    const factor = await this.createFactor(
      totalPrice,
      representativeShareOfSolutionForOrganization,
      validateAndReturnCartableItemDto,
      transaction,
    );

    // create factor service detail
    await this.createFactorService(
      factor,
      activeContract,
      dto,
      solutionItems,
      user,
      transaction,
    );
    return factor;
  }

  private async createFactor(
    tomanTotalPrice: number,
    representativeShareOfSolutionForOrganization: number,
    validateAndReturnCartableItem: ValidateAndReturnCartableItemDto,
    transaction: Transaction,
  ) {
    const guaranteeRequest = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: validateAndReturnCartableItem.request.id })
        .transaction(transaction)
        .build(),
    );
    const rialTotalPrice = tomanTotalPrice * 10;
    const rialRepresentativeShareOfSolutionForOrganization =
      representativeShareOfSolutionForOrganization * 10;
    const increaseDay = 31;
    const factor = await this.factorRepository.create(
      {
        unitPriceId: GSUnitPriceEnum.Rial,
        totalPrice: rialTotalPrice,
        factorStatusId: GSFactorStatusEnum.WaitingForPayment,
        factorTypeId: GSFactorTypeEnum.PayRequestFactor,
        userId: validateAndReturnCartableItem.request.userId,
        expireDate: Sequelize.fn(
          'dateadd',
          Sequelize.literal('day'),
          increaseDay,
          Sequelize.fn('getdate'),
        ),
        requestId: validateAndReturnCartableItem.request.id,
        guaranteeId: guaranteeRequest.guaranteeId,
        representativeShareOfSolution:
          rialRepresentativeShareOfSolutionForOrganization,
      },

      { transaction: transaction },
    );
    return factor;
  }

  private async createFactorService(
    factor: GSFactor,
    activeContract: GSGuaranteeOrganizationContract,
    dto: SubmitSolutionItemDto,
    solutionItems: SolutionOutputDto[],
    createdByUser: User,
    transaction: Transaction,
  ) {
    const parts = dto.partItems;
    const solutionDtos = dto.solutionItems;

    for (const part of parts) {
      await this.factorServiceRepository.create(
        {
          factorId: factor.id,
          unitPriceId: GSUnitPriceEnum.Rial,
          qty: part.qty,
          warrantyServiceTypeId: part.warrantyServiceType,
          price: part.price * 10 * part.qty,
          serviceTypeId: GSServiceTypeEnum.Part,
          createdByUserId: createdByUser.id,
        },
        {
          transaction: transaction,
        },
      );
    }

    for (const solution of solutionDtos) {
      const findSolutionFromDatabase = solutionItems.find(
        (solutionItem) => solutionItem.id == solution.solutionId,
      );
      await this.factorServiceRepository.create(
        {
          factorId: factor.id,
          solutionId: solution.solutionId,
          qty: 1,
          unitPriceId: GSUnitPriceEnum.Rial,
          price: Number(findSolutionFromDatabase.fee) * 10,
          warrantyServiceType: solution.warrantyServiceType,
          serviceTypeId: GSServiceTypeEnum.Solution,
          createdByUser: createdByUser.id,
          representativeShareOfSolution:
            (Number(findSolutionFromDatabase.fee) *
              10 *
              activeContract.representativeShare) /
            100,
        },
        { transaction: transaction },
      );
    }
  }

  private async findSolutionItemsFromDatabase(
    requestId: bigint,
    solutionItems: SolutionArrayDto[],
  ) {
    const solutionOutputs: SolutionOutputDto[] = [];
    for (const solutionItem of solutionItems) {
      const solution = await this.solutionService.findById(
        solutionItem.solutionId,
        { requestId: requestId },
      );
      solutionOutputs.push(solution.result);
    }
    return solutionOutputs;
  }

  private async calculatePartPrice(partItems: PartArrayDto[]) {
    const totalPrice = partItems.reduce((acc, part) => {
      return acc + part.price * part.qty;
    }, 0);
    return totalPrice;
  }

  private async createLocalTransactionFromFactor(
    factor: GSFactor,
    request: GSRequest,
    transaction: Transaction,
  ) {
    switch (request.requestCategoryId) {
      case GSRequestCategoryEnum.NormalGuarantee:
        await this.createLocalNormalGuaranteeTransaction(
          factor,
          request,
          transaction,
        );
        break;
      case GSRequestCategoryEnum.VIPGuarantee:
        await this.createLocalVipGuaranteeTransaction(
          factor,
          request,
          transaction,
        );
        break;
      default:
        break;
    }
  }

  private async createLocalNormalGuaranteeTransaction(
    factor: GSFactor,
    request: GSRequest,
    transaction: Transaction,
  ) {
    const factorServices = await GSFactorService.findAll(
      new QueryOptionsBuilder()
        .filter({
          warrantyServiceTypeId: GSWarrantyServiceTypeEnum.IncludeWarranty,
        })
        .filter({ factorId: factor.id })
        .transaction(transaction)
        .build(),
    );

    // rial price

    const prices = factorServices.map((factorService) =>
      this.rialPriceService.getRialPrice({
        price: Number(factor.totalPrice),
        unitPriceId: factor.unitPriceId as GSUnitPriceEnum,
      }),
    );
    const totalPrice = prices.reduce((prev, next) => prev + next, 0);

    const paymentGateway = await this.findNormalGuaranteePaymentGateway();

    const transactionEntity = await this.transactionRepository.create(
      {
        paymentGatewayId: paymentGateway.id,
        transactionStatusId: GSTransactionStatusEnum.Paid,
        unitPriceId: GSUnitPriceEnum.Rial,
        totalPrice: totalPrice,
        factorId: factor.id,
        userId: factor.userId,
      },
      { transaction: transaction },
    );
  }

  private async createLocalVipGuaranteeTransaction(
    factor: GSFactor,
    request: GSRequest,
    transaction: Transaction,
  ) {}

  private async findNormalGuaranteePaymentGateway() {
    const paymentGateway = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ paymentWayId: GSPaymentWayEnum.NormalGuarantee })
        .build(),
    );

    if (paymentGateway) {
      throw new InternalServerErrorException(
        'cannot find payment gateway for normal guarantee',
      );
    }

    return paymentGateway;
  }
}
