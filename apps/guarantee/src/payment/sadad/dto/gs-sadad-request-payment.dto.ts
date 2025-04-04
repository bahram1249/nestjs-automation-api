export class GSSadadRequestPaymentDto {
  TerminalId: string;
  MerchantId: string;
  Amount: number;
  OrderId: bigint;
  LocalDateString: string;
  ReturnUrl: string;
  SignData: string;
  UserId?: bigint;
}
