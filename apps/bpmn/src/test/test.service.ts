import { Injectable } from '@nestjs/common';
import { RequestService } from '../modules/request/request.service';

@Injectable()
export class TestService {
  constructor(private readonly requestService: RequestService) {}

  async createRequest() {
    await this.requestService.initRequest({
      userId: BigInt(1),
      processId: 1,
      description: 'test',
    });
  }
}
