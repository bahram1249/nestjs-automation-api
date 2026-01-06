import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CLIENT_REWARD_SMS_SENDER_QUEUE } from '../constants';
import { SmsSenderService } from '@rahino/guarantee/shared/sms-sender';
import { formatPersianAmount } from '@rahino/commontools/functions';

@Processor(CLIENT_REWARD_SMS_SENDER_QUEUE)
export class ClientRewardSmsSenderProcessor extends WorkerHost {
  constructor(private readonly smsSenderService: SmsSenderService) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      // Format amount with Persian numerals and comma separators
      const formattedAmount = formatPersianAmount(job.data.rewardAmount);
      const template = `جناب آقای/خانم ${job.data.firstname} ${job.data.lastname}، تبریک! به مناسبت ثبت کارت گارانتی، کارت VIP با اعتبار ${formattedAmount} تومان برای شما ایجاد گردید.`;

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
