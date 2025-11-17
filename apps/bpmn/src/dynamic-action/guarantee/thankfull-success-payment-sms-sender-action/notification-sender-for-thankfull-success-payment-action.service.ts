import { Injectable, Inject } from '@nestjs/common';
import { ActionServiceImp } from '../../../action/interface';
import { SourceExecuteActionDto } from '../../../action/dto';
import { InjectQueue } from '@nestjs/bullmq';
import { THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/thankfull-success-payment-sms-sender/constants';
import { Queue } from 'bullmq';
import { GetUser } from '@rahino/auth';

@Injectable()
export class NotificationSenderForThankfullSuccessPaymentActionService
  implements ActionServiceImp
{
  constructor(
    @InjectQueue(THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE)
    private readonly smsQueue: Queue,
  ) {}
  async executeAction(
    sourceExecuteAction: SourceExecuteActionDto,
    user: GetUser,
  ): Promise<boolean> {
    await this.smsQueue.add('sendThankYouSms', {
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
    });
    return true;
  }
}
