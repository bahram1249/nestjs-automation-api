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
}
