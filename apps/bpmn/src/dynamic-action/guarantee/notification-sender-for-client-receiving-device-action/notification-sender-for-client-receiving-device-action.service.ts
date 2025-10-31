import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { PersianDate, User } from '@rahino/database';
import { GSRequest } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Queue } from 'bullmq';
import { CLIENT_RECEIVING_DEVICE_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-receiving-device-sms-sender/constants';
import { Op, Sequelize } from 'sequelize';
import * as moment from 'moment';

@Injectable()
export class NotificationSenderForClientReceivingDeviceActionService
  implements ActionServiceImp
{
  constructor(
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectQueue(CLIENT_RECEIVING_DEVICE_SMS_SENDER_QUEUE)
    private readonly clientReceivingDeviceQueue: Queue,
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
        .transaction(dto.transaction)
        .filter({ id: dto.request.id })
        .build(),
    );

    await this.sendNotification(request.user);
  }

  private async sendNotification(user: User) {
    const today = moment().format('YYYY-MM-DD');
    const persianDate = await this.persianDateRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.col('GregorianDate'), {
            [Op.eq]: Sequelize.literal(`'${today}'`),
          }),
        )
        .build(),
    );

    const currentDate = persianDate?.DayNameInYear ?? today;

    await this.clientReceivingDeviceQueue.add(
      'send-client-receiving-device-sms',
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phoneNumber: user.phoneNumber,
        currentDate,
      },
    );
  }
}
