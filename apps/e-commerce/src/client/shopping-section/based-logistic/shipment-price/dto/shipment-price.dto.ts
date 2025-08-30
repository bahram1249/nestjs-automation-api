import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';

export interface ShipmentStockInput {
  weight?: number;
  qty?: number;
  freeShipment?: boolean;
  totalPrice?: number;
  // Optional unique identifier of the stock/item. Helpful for grouping logic.
  stockId?: string | number | bigint;
  // Optional explicit grouping key assigned by FE for the current shipment method.
  // All items with the same groupKey will be treated as a merged parcel (for post).
  groupKey?: string;
  // Optional list of other stock IDs this item can be merged with (fallback when groupKey is not provided).
  supportedStockIds?: Array<string | number | bigint>;
}

export interface ShipmentPriceResult {
  type: OrderShipmentwayEnum;
  typeName: string;
  price: number;
  realShipmentPrice: number;
}

// New: FE-driven selection group to calculate shipping exactly as UI shows
export interface ShipmentSelectionGroupInput {
  logisticId: number;
  // The selected shipment way DB id (e.g., ECLogisticShipmentWay.id)
  shipmentWayId: number;
  // The semantic type of shipment way to route calculation logic (delivery|post|pickup)
  shipmentWayType: OrderShipmentwayEnum;
  // The selected schedule sending period/type id (e.g., normal|express type id)
  sendingPeriodId?: number | null;
  // Weekly period and time ids if applicable
  weeklyPeriodId?: number | null;
  weeklyPeriodTimeId?: number | null;
  // The stocks in this merged group
  stocks: ShipmentStockInput[];
}

export interface ShipmentSelectionGroupResult {
  logisticId: number;
  shipmentWayId: number;
  shipmentWayType: OrderShipmentwayEnum;
  sendingPeriodId?: number | null;
  weeklyPeriodId?: number | null;
  weeklyPeriodTimeId?: number | null;
  price: number; // applied price after free/discount rules
  realShipmentPrice: number; // base price before free/discount rules
}

export interface SelectionsShipmentPriceResult {
  groups: ShipmentSelectionGroupResult[];
  totalPrice: number;
  totalRealShipmentPrice: number;
}

// Wrapper request for validating selections before payment
export interface SelectionsShipmentPriceInput {
  addressId?: number | null;
  couponCode?: string | null;
  groups: ShipmentSelectionGroupInput[];
}
