import { Injectable } from '@nestjs/common';
import { MessageInterface, SmsProviderInterface } from '../interface';
import axios from 'axios';
@Injectable()
export class MeliPayamakService implements SmsProviderInterface {
  async sendMessage(
    username: string,
    password: string,
    message: MessageInterface,
  ) {
    const request = await axios.post(
      'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber',
      {
        username: username,
        password: password,
        to: message.to,
        text: message.text,
        bodyId: message.bodyId,
      },
    );
  }
}
