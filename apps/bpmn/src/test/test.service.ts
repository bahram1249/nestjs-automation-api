import { Injectable } from '@nestjs/common';
import { BPMNRequestService } from '../modules/request/request.service';

@Injectable()
export class TestService {
  constructor(private readonly requestService: BPMNRequestService) {}

  async createRequest() {
    await this.requestService.initRequest({
      userId: BigInt(1),
      processId: 1,
      description: 'test',
    });
  }
}
