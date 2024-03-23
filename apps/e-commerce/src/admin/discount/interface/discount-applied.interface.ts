export interface DiscountAppliedInterface {
  id: bigint;
  amount: number;
  maxValue?: number;
  actionType: number;
  newPrice: number;
  startDate?: Date;
  endDate?: Date;
}
