import { SmsProviderInterface } from './provider.interface';

export interface SmsModuleOptions {
  token: string;
  smsProvider: SmsProviderInterface;
}
