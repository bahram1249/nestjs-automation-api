import { MessageInterface } from './message.interface';

export interface SmsProviderInterface {
  sendMessage(username: string, password: string, message: MessageInterface);
}
