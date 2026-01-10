import { GSDiscountCode } from '@rahino/localdatabase/models';

export interface DiscountValidationResult {
  isValid: boolean;
  canApply: boolean;
  discountAmount?: bigint;
  finalPrice?: bigint;
  discountCode?: GSDiscountCode;
  error?: string;
}
