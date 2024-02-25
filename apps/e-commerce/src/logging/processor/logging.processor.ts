import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { REQUEST_LOGGING_QUEUE } from '../constants';
import { LoggingService } from '../service';
import { RequestDataInterface } from '../interface';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';

@Processor(REQUEST_LOGGING_QUEUE)
export class LoggingProcessor extends WorkerHost {
  constructor(private readonly logginService: LoggingService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    const requestData: RequestDataInterface = job.data.requestData;
    const session: ECUserSession = job.data.session;

    await this.logginService.logRequest(requestData, session);

    return Promise.resolve(true);
  }
}
