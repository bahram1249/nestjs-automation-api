import { Injectable } from '@nestjs/common';
import {
  GSFactor,
  GSFactorAdditionalPackage,
  GSFactorService,
  GSFactorVipBundle,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { GSFactorTypeEnum } from '../factor-type';
import { GSFactorItemOutputDto } from './dto/factor-item.output';
import { GSServiceTypeEnum } from '../service-type';
import { GSFactorOutputDto } from './dto/factor-output.dto';
import { GSFactorTransactionOutputDto } from './dto/factor-transactions.output';

@Injectable()
export class GSSuccessFactorQueryBuilderMapper {
  constructor() {}

  mapItems(items: GSFactor[]): GSFactorOutputDto[] {
    return items.map((item) => this.mapItem(item));
  }

  mapItem(item: GSFactor): GSFactorOutputDto {
    let factorItems: GSFactorItemOutputDto[] = [];
    switch (item.factorTypeId) {
      case GSFactorTypeEnum.BuyAdditionalPackage:
        factorItems = this.mapAdditionalPackages(item.factorAdditionalPackages);
        break;
      case GSFactorTypeEnum.PayRequestFactor:
        factorItems = this.mapFactorServices(item.factorServices);
        break;
      case GSFactorTypeEnum.BuyVipCard:
        factorItems = this.mapFactorVipBundles(item.factorVipBundles);
        break;
    }
    const transactions = this.mapTransactions(item.transactions);
    return {
      id: item.id,
      createdAt: item.createdAt,
      factorStatusId: item.factorStatusId,
      factorTypeId: item.factorTypeId,
      totalPrice: item.totalPrice,
      unitPriceId: item.unitPriceId,
      requestId: item.requestId,
      representativeShareOfSolution: item.representativeShareOfSolution,
      settlementDate: item.settlementDate,
      createdByUserId: item.createdByUserId,
      factorItems: factorItems,
      transactions: transactions,
      fullName: item.user.firstname + ' ' + item.user.lastname,
      nationalCode: item.user.nationalCode,
      userTypeId: item.user.userTypeId,
      userTypeTitle: item.user.userType?.title,
    };
  }

  mapFactorVipBundles(
    factorVipBundles: GSFactorVipBundle[],
  ): GSFactorItemOutputDto[] {
    return factorVipBundles.map(
      (factorVipBundle): GSFactorItemOutputDto => ({
        title: factorVipBundle.vipBundleType.title,
        price: factorVipBundle.itemPrice,
        qty: 1,
      }),
    );
  }

  mapAdditionalPackages(
    additionalPackages: GSFactorAdditionalPackage[],
  ): GSFactorItemOutputDto[] {
    return additionalPackages.map(
      (additionalPackage): GSFactorItemOutputDto => ({
        title: additionalPackage.additionalPackage.title,
        price: additionalPackage.itemPrice,
        qty: 1,
      }),
    );
  }

  mapFactorServices(
    factorServices?: GSFactorService[],
  ): GSFactorItemOutputDto[] {
    return factorServices?.map(
      (factorService): GSFactorItemOutputDto => ({
        title:
          factorService.serviceTypeId == GSServiceTypeEnum.Part
            ? factorService.partName
            : factorService.solution?.title,
        price: factorService.price,
        qty: factorService.qty,
      }),
    );
  }

  mapTransactions(
    transactions?: GSTransaction[],
  ): GSFactorTransactionOutputDto[] {
    return transactions.map(
      (transaction): GSFactorTransactionOutputDto => ({
        id: transaction.id,
        gatewayTitle: transaction.paymentGateway.title,
        price: transaction.totalPrice,
      }),
    );
  }
}
