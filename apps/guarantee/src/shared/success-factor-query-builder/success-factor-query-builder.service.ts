import { Injectable, Scope } from '@nestjs/common';
import {
  BPMNOrganization,
  GSAdditionalPackage,
  GSFactorAdditionalPackage,
  GSFactorService,
  GSFactorStatus,
  GSFactorType,
  GSGuaranteeOrganization,
  GSPaymentGateway,
  GSRequest,
  GSServiceType,
  GSSolution,
  GSTransaction,
  GSUnitPrice,
  GSWarrantyServiceType,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSFactorStatusEnum } from '../factor-status';
import { GSFactorTypeEnum } from '../factor-type';
import { Op } from 'sequelize';
import { User } from '@rahino/database';

@Injectable({ scope: Scope.REQUEST })
export class GSSuccessFactorQueryBuilderService {
  private builder: QueryOptionsBuilder;
  constructor() {}

  init() {
    this.builder = new QueryOptionsBuilder()
      .include([
        {
          model: GSRequest,
          as: 'guaranteeRequest',
          required: false,
          include: [{ model: BPMNOrganization, as: 'bpmnOrganization' }],
        },
      ])
      .filter({
        factorStatusId: GSFactorStatusEnum.Paid,
      });
    return this;
  }

  requiredIncluded() {
    this.builder = this.builder
      .thenInclude({
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
      })
      .thenInclude({
        model: GSFactorAdditionalPackage,
        as: 'factorAdditionalPackages',
        required: false,
        include: [
          {
            model: GSAdditionalPackage,
            as: 'additionalPackage',
            attributes: ['id', 'title'],
          },
        ],
        attributes: ['id', 'additionalPackageId', 'itemPrice', 'unitPriceId'],
      })
      .thenInclude({
        attributes: [
          'id',
          'solutionId',
          'qty',
          'partName',
          'price',
          'representativeShareOfSolution',
          'warrantyServiceTypeId',
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
            attributes: ['id', 'title'],
          },
        ],
      })
      .thenInclude({
        model: GSFactorType,
        as: 'factorType',
        attributes: ['id', 'title'],
      })
      .thenInclude({
        model: GSFactorStatus,
        as: 'factorStatus',
        attributes: ['id', 'title'],
      })
      .thenInclude({
        model: GSUnitPrice,
        as: 'unitPrice',
        attributes: ['id', 'title'],
      });

    return this;
  }

  requiredAttributes() {
    this.builder = this.builder.attributes([
      'id',
      'factorTypeId',
      'factorStatusId',
      'requestId',
      'settlementDate',
      'createdByUserId',
      'representativeShareOfSolution',
      'totalPrice',
      'unitPriceId',
      'createdAt',
    ]);
    return this;
  }

  dateGreaterThan(date?: Date) {
    this.builder = this.builder.filterIf(date != null, {
      settlementDate: {
        [Op.gte]: date,
      },
    });
    return this;
  }

  dateLessThan(date?: Date) {
    this.builder = this.builder.filterIf(date != null, {
      settlementDate: {
        [Op.lte]: date,
      },
    });
    return this;
  }

  cartableFilter(dto: { userId?: bigint; organizationId?: number }) {
    const conditions = [];
    if (dto.userId != null) {
      conditions.push({ createdByUserId: dto.userId });
    }
    if (dto.organizationId != null) {
      conditions.push({
        '$guaranteeRequest.organizationId$': dto.organizationId,
      });
    }
    this.builder = this.builder.filter({ [Op.or]: conditions });
    return this;
  }

  filterByFactorType(factorType: GSFactorTypeEnum) {
    this.builder = this.builder.filter({ factorTypeId: factorType });
    return this;
  }

  factorOwner(userId: bigint) {
    this.builder = this.builder.filter({ userId: userId });
    return this;
  }

  filterFactorId(factorId?: bigint) {
    this.builder = this.builder.filterIf(factorId != null, { id: factorId });
    return this;
  }

  limit(count?: number) {
    this.builder = this.builder.limit(count);
    return this;
  }

  offset(count?: number) {
    this.builder = this.builder.offset(count);
    return this;
  }

  build() {
    return this.builder.build();
  }
}
