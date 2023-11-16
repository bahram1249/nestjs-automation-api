import { ConfigService } from '@nestjs/config';
import { IPay } from '../interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SepProvider implements IPay {
  constructor() {}
  async generateToken(
    terminalId: string,
    amount: bigint,
    paymentId: string,
    redirectUrl: string,
    phoneNumber: string,
  ): Promise<string> {
    const requestBody = {
      action: 'Token',
      TerminalId: terminalId,
      Amount: amount,
      ResNum: paymentId,
      RedirectUrl: redirectUrl,
      CellNumber: phoneNumber,
    };
    const request = await axios.post(
      'https://sep.shaparak.ir/onlinepg/onlinepg',
      requestBody,
    );

    if (request.status > 299 || request.status < 200) {
      throw new InternalServerErrorException('SEP_GET_TOKEN_RESPONSE_ERROR');
    }
    if (request.data.status != 1) {
      throw new InternalServerErrorException(
        'SEP_GET_TOKEN_RESPONSE_PAYLOAD_ERROR: Status Code',
      );
    }
    if (!request.data.token) {
      throw new InternalServerErrorException(
        'SEP_GET_TOKEN_RESPONSE_PAYLOAD_ERROR: Token Not Provided!',
      );
    }
    return String(request.data.token);
  }
}
