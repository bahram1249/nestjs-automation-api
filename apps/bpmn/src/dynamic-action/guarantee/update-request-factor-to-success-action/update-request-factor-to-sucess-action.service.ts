import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { GSSharedFactorDetailAndRemainingAmountService } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';
import { GSFactorStatusEnum } from '@rahino/guarantee/shared/factor-status';
import { GSPaymentWayEnum } from '@rahino/guarantee/shared/payment-way';
import { GSServiceTypeEnum } from '@rahino/guarantee/shared/service-type';
import { GSTransactionStatusEnum } from '@rahino/guarantee/shared/transaction-status';
import { GSWarrantyServiceTypeEnum } from '@rahino/guarantee/shared/warranty-service-type';
import {
  BPMNOrganization,
  GSFactor,
  GSFactorService,
  GSPaymentGateway,
  GSRequest,
  GSServiceType,
  GSSolution,
  GSTransaction,
  GSWarrantyServiceType,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';

@Injectable()
export class UpdateRequestFactorToSucessActionService
  implements ActionServiceImp
{
  constructor(
    private readonly factorDeatilAndRemainingAmountService: GSSharedFactorDetailAndRemainingAmountService,
    @InjectModel(GSFactor)
    private readonly factorRepository: typeof GSFactor,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const { result } =
      await this.factorDeatilAndRemainingAmountService.getFactorDetailAndRemainingAmount(
        dto.request.id,
        dto.transaction,
      );
    const factorId = result.factor.id;

    const factor = await this.factorRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSRequest,
            as: 'guaranteeRequest',
            required: true,
            include: [{ model: BPMNOrganization, as: 'bpmnOrganization' }],
          },
        ])
        .thenInclude({
          attributes: [
            'id',
            'solutionId',
            'qty',
            'partName',
            'price',
            'representativeShareOfSolution',
            'warrantyServiceTypeId',
            'serviceTypeId',
            'unitPriceId',
          ],
          model: GSFactorService,
          as: 'factorServices',
          required: false,
          where: {
            isDeleted: {
              [Op.is]: null,
            },
          },
          include: [
            {
              model: GSSolution,
              as: 'solution',
              attributes: ['id', 'title'],
              required: false,
            },
            {
              model: GSWarrantyServiceType,
              as: 'warrantyServiceType',
              attributes: ['id', 'title'],
            },
            {
              model: GSServiceType,
              as: 'serviceType',
              attributes: ['id', 'title'],
            },
          ],
        })
        .thenInclude({
          model: GSTransaction,
          as: 'transactions',
          required: false,
          attributes: [
            'id',
            'transactionStatusId',
            'totalPrice',
            'paymentGatewayId',
            'unitPriceId',
          ],
          include: [
            {
              model: GSPaymentGateway,
              as: 'paymentGateway',
              attributes: ['id', 'title', 'paymentWayId'],
            },
          ],
          where: {
            transactionStatusId: GSTransactionStatusEnum.Paid,
          },
        })
        .filter({ id: factorId })
        .transaction(dto.transaction)
        .build(),
    );

    const factorServices = factor.factorServices;
    const transactions = factor.transactions;

    const sumOfSolutionIncludeWarranty = factorServices
      .filter(
        (factorService) =>
          factorService.warrantyServiceTypeId ==
            GSWarrantyServiceTypeEnum.IncludeWarranty &&
          factorService.serviceTypeId == GSServiceTypeEnum.Solution,
      )
      .map((item) => item.price)
      .reduce((acc, curr) => Number(acc) + Number(curr), 0);

    const sumOfSolutionOutOfWarranty = factorServices
      .filter(
        (factorService) =>
          factorService.warrantyServiceTypeId ==
            GSWarrantyServiceTypeEnum.OutOfWarranty &&
          factorService.serviceTypeId == GSServiceTypeEnum.Solution,
      )
      .map((item) => item.price)
      .reduce((acc, curr) => Number(acc) + Number(curr), 0);

    const sumOfPartIncludeWarranty = factorServices
      .filter(
        (factorService) =>
          factorService.warrantyServiceTypeId ==
            GSWarrantyServiceTypeEnum.IncludeWarranty &&
          factorService.serviceTypeId == GSServiceTypeEnum.Part,
      )
      .map((item) => item.price)
      .reduce((acc, curr) => Number(acc) + Number(curr), 0);

    const sumOfPartOutOfWarranty = factorServices
      .filter(
        (factorService) =>
          factorService.warrantyServiceTypeId ==
            GSWarrantyServiceTypeEnum.OutOfWarranty &&
          factorService.serviceTypeId == GSServiceTypeEnum.Part,
      )
      .map((item) => item.price)
      .reduce((acc, curr) => Number(acc) + Number(curr), 0);

    const atLeastPayFromCustomerForOutOfWarranty =
      sumOfPartOutOfWarranty + sumOfSolutionOutOfWarranty;

    const givenCashPayment = transactions
      .filter(
        (tran) =>
          tran.paymentGateway.paymentWayId == GSPaymentWayEnum.Cash ||
          tran.paymentGateway.paymentWayId == GSPaymentWayEnum.Online,
      )
      .map((tran) => tran.totalPrice)
      .reduce((acc, curr) => Number(acc) + Number(curr), 0);

    const extraCashPaymentForUnavailableVip =
      givenCashPayment - atLeastPayFromCustomerForOutOfWarranty;

    const organizationToCompany =
      sumOfSolutionOutOfWarranty *
      (1 - factor.representativeSharePercent / 100);

    const companyToOrganization =
      sumOfPartIncludeWarranty +
      sumOfSolutionIncludeWarranty * (factor.representativeSharePercent / 100);

    const sumOfOrganizationToCompany =
      organizationToCompany + extraCashPaymentForUnavailableVip;
    const sumOfCompanyToOrganization = companyToOrganization;

    // update factor status to paid
    await this.factorRepository.update(
      {
        factorStatusId: GSFactorStatusEnum.Paid,
        settlementDate: new Date(),
        representativeSharePercent: factor.representativeSharePercent,
        sumOfSolutionIncludeWarranty,
        sumOfSolutionOutOfWarranty,
        sumOfPartIncludeWarranty,
        sumOfPartOutOfWarranty,
        atLeastPayFromCustomerForOutOfWarranty,
        givenCashPayment,
        extraCashPaymentForUnavailableVip,
        organizationToCompany,
        companyToOrganization,
        sumOfOrganizationToCompany,
        sumOfCompanyToOrganization,
      },
      {
        where: {
          id: factorId,
        },
        transaction: dto.transaction,
      },
    );
  }
}
