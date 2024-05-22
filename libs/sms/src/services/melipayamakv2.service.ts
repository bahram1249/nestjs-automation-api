import { Injectable } from '@nestjs/common';
import { MessageInterface, SmsProviderInterface } from '../interface';
import * as soap from 'soap';

@Injectable()
export class MeliPayamakV2Service implements SmsProviderInterface {
  async sendMessage(
    username: string,
    password: string,
    message: MessageInterface,
  ) {
    const url = 'https://api.payamak-panel.com/post/send.asmx?wsdl';
    const data = {
      username,
      password,
      to: message.to,
      text: message.text.split(';'),
      bodyId: message.bodyId,
    };
    const client = await soap.createClientAsync(url);
    const result = await client.SendByBaseNumberAsync(data);
  }
}
