import { UserType } from '@rahino/database';
import { GSFactorItemOutputDto } from './factor-item.output';
import { GSFactorTransactionOutputDto } from './factor-transactions.output';

export class GSFactorOutputDto {
  public id: bigint;
  public factorTypeId: number;
  public factorStatusId: number;
  public requestId?: bigint;
  public settlementDate?: Date;
  public createdByUserId?: bigint;
  public representativeShareOfSolution?: bigint;
  public totalPrice: bigint;
  public unitPriceId: number;
  public createdAt: Date;
  public factorItems: GSFactorItemOutputDto[];
  public transactions: GSFactorTransactionOutputDto[];
  public fullName: string;
  public nationalCode: string;
  public userTypeId: number;
  public userTypeTitle: string;
}
