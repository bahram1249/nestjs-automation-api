import { Injectable, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/thankfull-success-payment-sms-sender/constants';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { User } from '@rahino/database';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class NotificationSenderForThankfullSuccessPaymentActionService
  implements ActionServiceImp
{
  constructor(
    @InjectQueue(THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE)
    private readonly smsQueue: Queue,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: User,
            as: 'user',
            required: true,
            attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
          },
        ])
        .filter({ id: dto.request.id })
        .transaction(dto.transaction)
        .build(),
    );

    await this.sendNotification(request.user);
  }

  private async sendNotification(user: User) {
    await this.smsQueue.add('sendThankYouSms', {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
    });
  }
}
