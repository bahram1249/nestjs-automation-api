import { IPay } from '../../interface';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { VerifyTransaction } from '.';

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
  generateRedirectUrl(token: string): string {
    return `https://sep.shaparak.ir/OnlinePG/SendToken?token=${token}`;
  }

  async verifyTransaction(
    amount: bigint,
    terminalId: string,
    refNum: string,
  ): Promise<any> {
    const requestBody = {
      RefNum: refNum,
      TerminalNumber: Number(terminalId),
    };
    const request = await axios.post<VerifyTransaction>(
      'https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction',
      requestBody,
    );
    if (request.data.Success == false) {
      throw new BadRequestException(request.data.ResultDescription);
    }
    // if (request.data.TransactionDetail.OrginalAmount != amount) {
    //   const reverse = await this.reverseTransacion(terminalId, refNum);
    //   throw new BadRequestException('Something Wrong in Amount');
    // }

    return request.data;
  }
  async reverseTransacion(terminalId: string, refNum: string): Promise<any> {
    const requestBody = {
      RefNum: refNum,
      TerminalNumber: Number(terminalId),
    };
    const request = await axios.post<VerifyTransaction>(
      'https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/ReverseTransaction',
      requestBody,
    );
    if (request.data.Success == false) {
      throw new InternalServerErrorException(request.data);
    }
    return request.data;
  }
}
