import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TECHNICAL_USER_CARTABLE_REQUEST_SMS_SENDER_QUEUE } from '../constants';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';

@Processor(TECHNICAL_USER_CARTABLE_REQUEST_SMS_SENDER_QUEUE)
export class TechnicalUserCartableSmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const requestType = job.data.requestTypeId == 1 ? 'نصب' : 'تعمیر';
      const template = `آقا/خانم ${job.data.firstname} ${job.data.lastname} درخواست ${requestType} جدیدی جهت مراجعه در روز ${job.data.date} و در ساعت ${job.data.time} برای شما ثبت گردیده است. لطفا برای جزییات بیشتر به کارتابل خود مراجعه فرمایید.`;
      await this.smsSenderService.sendSms({
        phoneNumber: job.data.phoneNumber,
        message: template,
      });
    } catch (error) {
      return Promise.reject(true);
    }
    return Promise.resolve(true);
  }
}
