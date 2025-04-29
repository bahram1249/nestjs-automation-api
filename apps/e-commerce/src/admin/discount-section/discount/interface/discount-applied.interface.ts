export interface DiscountAppliedInterface {
  id: bigint;
  amount: number;
  maxValue?: number;
  actionType: number;
  discountTypeId: number;
  discountTypeName: string;
  newPrice: number;
  startDate?: Date;
  endDate?: Date;
  freeShipment?: boolean;
}
