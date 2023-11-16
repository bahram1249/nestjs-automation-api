import { IPay } from './ipay.interface';

export interface PayModuleOptions {
  token: string;
  paymentProvider: IPay;
}
