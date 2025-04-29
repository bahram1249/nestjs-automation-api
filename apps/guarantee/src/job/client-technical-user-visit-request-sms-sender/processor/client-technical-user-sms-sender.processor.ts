import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CLIENT_TECHNICAL_USER_VISIT_REQUEST_SMS_SENDER_QUEUE } from '../constants';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';

@Processor(CLIENT_TECHNICAL_USER_VISIT_REQUEST_SMS_SENDER_QUEUE)
export class ClientTechnicalUserVisitSmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const requestType = job.data.requestTypeId == 1 ? 'نصب' : 'تعمیر';
      const template = `آقا/خانم ${job.data.firstname} ${job.data.lastname} درخواست ${requestType} شما جهت مراجعه نماینده در روز ${job.data.date} و در ساعت ${job.data.time} جهت مراجعه به محل درخواستی شما اعزام میگردد. لطفا در روز و ساعت مقرر شده در محل حضور داشته باشید`;
      await this.smsSenderService.sendSms({
        phoneNumber: job.data.phoneNumber,
        message: template,
      });
    } catch (error) {
      return Promise.reject(error.message);
    }
    return Promise.resolve(true);
  }
}
