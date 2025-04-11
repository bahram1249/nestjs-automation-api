import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSFactor,
  GSFactorService,
  GSGuaranteeOrganization,
  GSPaymentGateway,
  GSRequest,
  GSSolution,
  GSTransaction,
  GSWarrantyServiceType,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { GSTransactionStatusEnum } from '../transaction-status';
import { RialPriceService } from '../rial-price';
import { GSFactorTypeEnum } from '../factor-type';
import { GSServiceTypeEnum } from '../service-type';
import { GSFactorServiceOutputDto } from './dto';

@Injectable()
export class GSSharedFactorDetailAndRemainingAmountService {
  constructor(
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,
    @InjectModel(GSTransaction)
    private readonly transactionRepository: typeof GSTransaction,
    @InjectModel(GSFactorService)
    private readonly factorServiceRepository: typeof GSFactorService,
    private readonly localizationService: LocalizationService,
    private readonly rialPriceService: RialPriceService,
    @InjectModel(GSGuaranteeOrganization)
    private readonly guaranteeOrganizationRepository: typeof GSGuaranteeOrganization,
  ) {}

  async getFactorDetailAndRemainingAmount(requestId: bigint) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: requestId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSRequest.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!request) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.guarantee_request_item_not_founded',
        ),
      );
    }

    const guaranteeOrganization =
      await this.guaranteeOrganizationRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: request.organizationId })
          .build(),
      );

    const factor = await this.factorRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ requestId: requestId })
        .filter({ factorTypeId: GSFactorTypeEnum.PayRequestFactor })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSFactor.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!factor) {
      throw new BadRequestException('invalid factor');
    }

    const partServices = await this.getPartServiceByFactorId(factor.id);
    const solutionServices = await this.getSolutionServiceByFactorId(factor.id);

    const transactions = await this.getPaidTransactionsByFactorId(factor.id);

    const totalPaidPrice = transactions
      .map((transaction) =>
        this.rialPriceService.getRialPrice({
          price: Number(transaction.totalPrice),
          unitPriceId: transaction.unitPriceId,
        }),
      )
      .reduce((prev, next) => prev + next, 0);

    const remainingAmount = Number(factor.totalPrice) - totalPaidPrice;

    return {
      result: {
        remainingAmount: remainingAmount,
        factor: factor,
        transactions: transactions,
        partServices: partServices,
        solutionServices: solutionServices,
        isOnlinePayment: guaranteeOrganization.isOnlinePayment == true,
      },
    };
  }

  private async getSolutionServiceByFactorId(
    factorId: bigint,
  ): Promise<GSFactorServiceOutputDto[]> {
    const solutionServices = await this.factorServiceRepository.findAll(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSWarrantyServiceType,
            as: 'warrantyServiceType',
            attributes: ['id', 'title'],
          },
          {
            model: GSSolution,
            as: 'solution',
            attributes: ['id', 'title'],
          },
        ])
        .filter({ factorId: factorId })
        .filter({ serviceTypeId: GSServiceTypeEnum.Solution })
        .build(),
    );
    return this.mappingSolutionServices(solutionServices);
  }

  private async getPartServiceByFactorId(
    factorId: bigint,
  ): Promise<GSFactorServiceOutputDto[]> {
    const partServices = await this.factorServiceRepository.findAll(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSWarrantyServiceType,
            as: 'warrantyServiceType',
            attributes: ['id', 'title'],
          },
        ])
        .filter({ factorId: factorId })
        .filter({ serviceTypeId: GSServiceTypeEnum.Part })
        .build(),
    );
    return this.mappingPartServices(partServices);
  }

  private mappingSolutionServices(services: GSFactorService[]) {
    return services.map((service) => this.mapSolutionService(service));
  }

  private mapSolutionService(
    service: GSFactorService,
  ): GSFactorServiceOutputDto {
    return {
      id: service.id,
      totalPrice: service.price,
      qty: service.qty,
      title: service.solution.title,
      warrantyServiceTypeId: service.warrantyServiceTypeId,
      warrantyServiceTypeTitle: service.warrantyServiceType.title,
    };
  }

  private mappingPartServices(services: GSFactorService[]) {
    return services.map((service) => this.mapPartService(service));
  }

  private mapPartService(service: GSFactorService): GSFactorServiceOutputDto {
    return {
      id: service.id,
      totalPrice: service.price,
      qty: service.qty,
      title: service.partName,
      warrantyServiceTypeId: service.warrantyServiceTypeId,
      warrantyServiceTypeTitle: service.warrantyServiceType.title,
    };
  }

  private async getPaidTransactionsByFactorId(factorId: bigint) {
    return await this.transactionRepository.findAll(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSPaymentGateway,
            as: 'paymentGateway',
            attributes: ['id', 'title'],
          },
        ])
        .filter({ factorId: factorId })
        .filter({ transactionStatusId: GSTransactionStatusEnum.Paid })
        .build(),
    );
  }
}
