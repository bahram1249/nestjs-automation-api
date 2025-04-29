export interface DiscountInterface {
  id: bigint;
  amount: number;
  maxValue?: number;
  actionType: number;
  discountTypeId: number;
  discountTypeName: string;
  startDate?: Date;
  endDate?: Date;
  freeShipment?: boolean;
}
