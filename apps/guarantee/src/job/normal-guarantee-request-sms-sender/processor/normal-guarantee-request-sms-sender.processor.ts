import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NORMAL_GUARANTEE_REQUEST_SMS_SENDER_QUEUE } from '../constants';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';
import { GSRequestTypeEnum } from '@rahino/guarantee/shared/request-type';

@Processor(NORMAL_GUARANTEE_REQUEST_SMS_SENDER_QUEUE)
export class NormalGuaranteeRequestSmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const requestTypeEnum = job.data.requesetTypeId as GSRequestTypeEnum;
      const requestType =
        requestTypeEnum == GSRequestTypeEnum.Install ? 'نصب' : 'تعمیر';
      const template = `${job.data.firstname} ${job.data.lastname} عزیز درخواست ${requestType} شما در کلاب آریاکیش ثبت گردید و پس از بررسی و تایید، اطلاع رسانی خواهد شد.`;
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
