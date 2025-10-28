import { Injectable, Scope } from '@nestjs/common';
import {
  BPMNOrganization,
  GSAdditionalPackage,
  GSFactorAdditionalPackage,
  GSFactorService,
  GSFactorStatus,
  GSFactorType,
  GSFactorVipBundle,
  GSGuaranteeOrganization,
  GSPaymentGateway,
  GSRequest,
  GSServiceType,
  GSSolution,
  GSTransaction,
  GSUnitPrice,
  GSVipBundleType,
  GSWarrantyServiceType,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSFactorStatusEnum } from '../factor-status';
import { GSFactorTypeEnum } from '../factor-type';
import { Op, Sequelize } from 'sequelize';
import { User, UserType } from '@rahino/database';
import { GSTransactionStatusEnum } from '../transaction-status';
import { Order } from '@rahino/query-filter';

@Injectable({ scope: Scope.REQUEST })
export class GSSuccessFactorQueryBuilderService {
  private builder: QueryOptionsBuilder;
  constructor() {}

  init(includeRequest = true) {
    this.builder = new QueryOptionsBuilder().filter({
      factorStatusId: GSFactorStatusEnum.Paid,
    });

    this.builder = includeRequest
      ? this.builder.include([
          {
            model: GSRequest,
            as: 'guaranteeRequest',
            required: true,
            include: [{ model: BPMNOrganization, as: 'bpmnOrganization' }],
          },
        ])
      : this.builder.include([]);

    this.builder = this.builder.thenInclude({
      model: User,
      as: 'user',
      attributes: [
        'id',
        'firstname',
        'lastname',
        'phoneNumber',
        'nationalCode',
        'userTypeId',
      ],
      required: true,
      include: [{ model: UserType, as: 'userType', required: false }],
    });

    return this;
  }

  requiredIncluded() {
    this.builder = this.builder

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
        model: GSFactorVipBundle,
        as: 'factorVipBundles',
        include: [{ model: GSVipBundleType, as: 'vipBundleType' }],
        required: false,
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

  cartableFilter(dto: {
    userId?: bigint;
    organizationId?: number;
    showTotal?: boolean;
    textFilter?: string;
  }) {
    const conditions = [];
    if (dto.userId != null) {
      conditions.push({ createdByUserId: dto.userId });
    }
    if (dto.organizationId != null) {
      conditions.push({
        '$guaranteeRequest.organizationId$': dto.organizationId,
      });
    }

    if (dto.showTotal) {
      conditions.push(Sequelize.literal(` 1=1 `));
    }

    const textConditions = [];

    if (dto.textFilter != null || dto.textFilter != '') {
      textConditions.push({
        '$user.phoneNumber$': {
          [Op.like]: dto.textFilter,
        },
      });
      textConditions.push({
        '$user.nationalCode$': {
          [Op.like]: dto.textFilter,
        },
      });
      textConditions.push({
        '$user.firstname$': {
          [Op.like]: dto.textFilter,
        },
      });
      textConditions.push({
        '$user.lastname$': {
          [Op.like]: dto.textFilter,
        },
      });
      // conditions.push({
      //   '$guaranteeRequest.id$': dto.textFilter,
      // });
      // conditions.push({
      //   '$GSFactor.id$': dto.textFilter,
      // });
    }

    const applyConditions = [{ [Op.or]: conditions }];

    if (dto.textFilter != null && dto.textFilter != '') {
      applyConditions.push({ [Op.or]: textConditions });
    }

    this.builder = this.builder.filter({
      [Op.and]: applyConditions,
    });

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

  filterIf(condition: boolean, filter: any) {
    this.builder = this.builder.filterIf(condition, filter);
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

  order(orderArg: Order) {
    this.builder = this.builder.order(orderArg);
    return this;
  }

  build() {
    return this.builder.build();
  }
}
