import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSPaymentWayEnum } from '../payment-way';
import {
  GSFactor,
  GSFactorService,
  GSGuarantee,
  GSGuaranteeOrganization,
  GSGuaranteeOrganizationContract,
  GSPaymentGateway,
  GSRequest,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { Op, Sequelize, Transaction } from 'sequelize';
import { GSUnitPriceEnum } from '../unit-price';
import { GSTransactionStatusEnum } from '../transaction-status';
import { GSWarrantyServiceTypeEnum } from '../warranty-service-type';
import { GSRequestCategoryEnum } from '../request-category';
import { User } from '@rahino/database';
import { SubmitSolutionItemDto } from './dto/submit-solution-item.dto';
import { ValidateAndReturnCartableItemDto } from '@rahino/guarantee/cartable/guarantee-traverse/dto';
import { PartArrayDto, SolutionArrayDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { RialPriceService } from '../rial-price';
import { GSServiceTypeEnum } from '../service-type';
import { SolutionOutputDto } from '@rahino/guarantee/cartable/solution/dto';
import { SolutionService } from '@rahino/guarantee/cartable/solution';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSFactorStatusEnum } from '../factor-status';
import { GSFactorTypeEnum } from '../factor-type';

@Injectable()
export class RequestFactorService {
  constructor(
    @InjectModel(GSRequest) private readonly repository: typeof GSRequest,
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
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepository: typeof GSGuarantee,
    private readonly solutionService: SolutionService,
    private readonly localizationService: LocalizationService,
  ) {}

  public async createFactorAndLocalTransaction(
    createdByUser: User,
    dto: SubmitSolutionItemDto,
    validateAndReturnCartableItemDto: ValidateAndReturnCartableItemDto,
    transaction: Transaction,
  ) {
    // dtos
    const partItems: PartArrayDto[] = dto.partItems;
    const solutionItemsDto: SolutionArrayDto[] = dto.solutionItems;

    // find guarantee request
    const request = await this.findGuaranteeRequest(
      validateAndReturnCartableItemDto.request.id,
      transaction,
    );

    const organization = await this.findOrganizationFromRequest(
      request,
      transaction,
    );

    // validation for contracts
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

    // get solutions from database based requestId
    const solutionItems = await this.findSolutionItemsFromDatabase(
      dto.requestId,
      solutionItemsDto,
    );

    // tomans
    const solutionTotalPrice = solutionItems
      .map((solutionItem) => solutionItem.fee)
      .reduce((prev, next) => Number(prev) + Number(next), 0);

    // total price in tomans
    const totalPrice = partTotalPrice + solutionTotalPrice;

    const representativeShareOfSolutionForOrganization =
      (activeContract.representativeShare * solutionTotalPrice) / 100;

    // create factor
    const factor = await this.createFactor(
      totalPrice,
      representativeShareOfSolutionForOrganization,
      activeContract.representativeShare,
      validateAndReturnCartableItemDto,
      createdByUser,
      transaction,
    );

    // create factor service detail
    await this.createFactorService(
      factor,
      activeContract,
      dto,
      solutionItems,
      createdByUser,
      transaction,
    );

    await this.createLocalTransactionFromFactor(factor, request, transaction);
  }

  private async createFactor(
    tomanTotalPrice: number,
    representativeShareOfSolutionForOrganization: number,
    representativeSharePercent: number,
    validateAndReturnCartableItem: ValidateAndReturnCartableItemDto,
    createdByUser: User,
    transaction: Transaction,
  ) {
    const guaranteeRequest = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: validateAndReturnCartableItem.request.id })
        .transaction(transaction)
        .build(),
    );
    const rialTotalPrice = this.rialPriceService.getRialPrice({
      price: tomanTotalPrice,
      unitPriceId: GSUnitPriceEnum.Toman,
    });
    const rialRepresentativeShareOfSolutionForOrganization =
      this.rialPriceService.getRialPrice({
        price: representativeShareOfSolutionForOrganization,
        unitPriceId: GSUnitPriceEnum.Toman,
      });

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
        createdByUserId: createdByUser.id,
        representativeSharePercent: representativeSharePercent,
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
          price:
            this.rialPriceService.getRialPrice({
              price: part.price,
              unitPriceId: GSUnitPriceEnum.Toman,
            }) * part.qty,
          serviceTypeId: GSServiceTypeEnum.Part,
          createdByUserId: createdByUser.id,
          partName: part.partName,
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
          price: this.rialPriceService.getRialPrice({
            price: Number(findSolutionFromDatabase.fee),
            unitPriceId: GSUnitPriceEnum.Toman,
          }),
          warrantyServiceTypeId: solution.warrantyServiceType,
          serviceTypeId: GSServiceTypeEnum.Solution,
          createdByUserId: createdByUser.id,
          representativeShareOfSolution:
            (this.rialPriceService.getRialPrice({
              price: Number(findSolutionFromDatabase.fee),
              unitPriceId: GSUnitPriceEnum.Toman,
            }) *
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
        { requestId: Number(requestId) },
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
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSFactorService.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .transaction(transaction)
        .build(),
    );

    // rial price

    const prices = factorServices.map((factorService) =>
      this.rialPriceService.getRialPrice({
        price: Number(factorService.price),
        unitPriceId: factorService.unitPriceId as GSUnitPriceEnum,
      }),
    );
    const totalPrice = prices.reduce((prev, next) => prev + next, 0);
    if (totalPrice == 0) return;

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
  ) {
    const factorServices = await GSFactorService.findAll(
      new QueryOptionsBuilder()
        .filter({ factorId: factor.id })
        .filter({
          warrantyServiceTypeId: GSWarrantyServiceTypeEnum.IncludeWarranty,
        })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSFactorService.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .transaction(transaction)
        .build(),
    );

    // rial price

    const prices = factorServices.map((factorService) =>
      this.rialPriceService.getRialPrice({
        price: Number(factorService.price),
        unitPriceId: factorService.unitPriceId as GSUnitPriceEnum,
      }),
    );
    const totalPrice = prices.reduce((prev, next) => prev + next, 0);

    const paymentGateway = await this.findVipGuaranteePaymentGateway();

    const guarantee = await this.guaranteeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: request.guaranteeId })
        .transaction(transaction)
        .build(),
    );

    // is rial
    const availableCredit = Number(guarantee.availableCredit);

    // skip
    if (availableCredit == 0) return;

    let canPaid = 0;

    if (totalPrice >= availableCredit) {
      canPaid = availableCredit;
    } else {
      canPaid = totalPrice;
    }

    guarantee.availableCredit = BigInt(availableCredit - canPaid);
    await guarantee.save({ transaction: transaction });

    const transactionEntity = await this.transactionRepository.create(
      {
        paymentGatewayId: paymentGateway.id,
        transactionStatusId: GSTransactionStatusEnum.Paid,
        unitPriceId: GSUnitPriceEnum.Rial,
        totalPrice: canPaid,
        factorId: factor.id,
        userId: factor.userId,
      },
      { transaction: transaction },
    );
  }

  private async findNormalGuaranteePaymentGateway() {
    const paymentGateway = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ paymentWayId: GSPaymentWayEnum.NormalGuarantee })
        .build(),
    );

    if (!paymentGateway) {
      throw new InternalServerErrorException(
        'cannot find payment gateway for normal guarantee',
      );
    }

    return paymentGateway;
  }

  private async findVipGuaranteePaymentGateway() {
    const paymentGateway = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ paymentWayId: GSPaymentWayEnum.VipBalance })
        .build(),
    );

    if (!paymentGateway) {
      throw new InternalServerErrorException(
        'cannot find payment gateway for normal guarantee',
      );
    }

    return paymentGateway;
  }

  private async findOrganizationFromRequest(
    request: GSRequest,
    transaction: Transaction,
  ) {
    return await this.organization.findOne(
      new QueryOptionsBuilder()
        .include({
          model: GSGuaranteeOrganizationContract,
          as: 'organizationContracts',
          where: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('getdate'), {
                [Op.between]: [
                  Sequelize.col('organizationContracts.startDate'),
                  Sequelize.col('organizationContracts.endDate'),
                ],
              }),
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('organizationContracts.isDeleted'),
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
  }

  private async findGuaranteeRequest(
    requestId: bigint,
    transaction: Transaction,
  ) {
    return await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: requestId })
        .transaction(transaction)
        .build(),
    );
  }
}
