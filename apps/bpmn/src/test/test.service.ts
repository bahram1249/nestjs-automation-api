import { Injectable } from '@nestjs/common';
import { RequestService } from '../request/request.service';

@Injectable()
export class TestService {
  constructor(private readonly requestService: RequestService) {}

  async createRequest() {
    await this.requestService.initRequest({
      userId: BigInt(1),
      processId: 1,
    });
  }
}
