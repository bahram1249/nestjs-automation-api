import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { REQUEST_LOGGING_QUEUE } from '../constants';
import { LoggingService } from '../service';
import { RequestDataInterface } from '../interface';
import { ECUserSession } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';

@Processor(REQUEST_LOGGING_QUEUE)
export class LoggingProcessor extends WorkerHost {
  constructor(private readonly logginService: LoggingService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    const requestData: RequestDataInterface = job.data.requestData;
    const session: ECUserSession = job.data.session;
    const user: User = job.data.user;

    await this.logginService.logRequest(requestData, session, user);

    return Promise.resolve(true);
  }
}
