export interface IPay {
  generateToken(
    terminalId: string,
    amount: bigint,
    paymentId: string,
    redirectUrl: string,
    phoneNumber: string,
  ): Promise<string>;
}
