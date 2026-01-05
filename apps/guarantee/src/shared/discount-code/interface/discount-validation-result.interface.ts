export interface DiscountValidationResult {
  isValid: boolean;
  canApply: boolean;
  discountAmount?: bigint;
  finalPrice?: bigint;
  error?: string;
}
