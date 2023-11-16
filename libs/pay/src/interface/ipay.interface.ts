export interface IPay {
  generateToken(
    terminalId: string,
    amount: bigint,
    paymentId: string,
    redirectUrl: string,
    phoneNumber: string,
  ): Promise<string>;
  generateRedirectUrl(token: string): string;
  verifyTransaction(
    amount: bigint,
    terminalId: string,
    refNum: string,
  ): Promise<any>;
  reverseTransacion(terminalId: string, refNum: string): Promise<any>;
}
