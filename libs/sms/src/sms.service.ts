import { MessageInterface, SmsProviderInterface } from './interface';

export class SmsService {
  constructor(
    private readonly username: string,
    private readonly password: string,
    private readonly smsProvider: SmsProviderInterface,
    private readonly bodyId?: string,
  ) {}
  async sendMessage(message: MessageInterface) {
    return await this.smsProvider.sendMessage(
      this.username,
      this.password,
      message,
      this.bodyId,
    );
  }
}
