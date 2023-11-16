import { IPay } from './interface';

export class PayService {
  constructor(private readonly paymentProvider: IPay) {}
  generateToken(
    terminalId: string,
    amount: bigint,
    paymentId: string,
    redirectUrl: string,
    phoneNumber: string,
  ) {
    return this.paymentProvider.generateToken(
      terminalId,
      amount,
      paymentId,
      redirectUrl,
      phoneNumber,
    );
  }
  generateRedirectUrl(token: string) {
    return this.paymentProvider.generateRedirectUrl(token);
  }
  async verifyTransaction(amount: bigint, terminalId: string, refNum: string) {
    return await this.paymentProvider.verifyTransaction(
      amount,
      terminalId,
      refNum,
    );
  }
  async reverseTransaction(terminalId: string, refNum: string) {
    return await this.paymentProvider.reverseTransacion(terminalId, refNum);
  }
}
