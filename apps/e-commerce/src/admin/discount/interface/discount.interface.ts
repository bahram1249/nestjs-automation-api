export interface DiscountInterface {
  id: bigint;
  amount: number;
  maxValue?: number;
  actionType: number;
  startDate?: Date;
  endDate?: Date;
}
