import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { PersianDate, User } from '@rahino/database';
import { GSRequest } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Queue } from 'bullmq';
import { NotificationSenderForTechnicalUserDto } from './dto';
import { Op, Sequelize } from 'sequelize';
import * as moment from 'moment';
import { CLIENT_TECHNICAL_USER_VISIT_REQUEST_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/client-technical-user-visit-request-sms-sender/constants';

@Injectable()
export class NotificationSenderForClientTechnicalVisitTimeRequestActionService
  implements ActionServiceImp
{
  constructor(
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectQueue(CLIENT_TECHNICAL_USER_VISIT_REQUEST_SMS_SENDER_QUEUE)
    private readonly clientTechnicalUserVisitRequestSmsSenderQueue: Queue,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
          },
        ])
        .transaction(dto.transaction)
        .filter({ id: dto.request.id })
        .build(),
    );
    const data: NotificationSenderForTechnicalUserDto = {
      date: request.technicalUserVisitDate,
      time: request.technicalUserVisitTime,
      requestTypeId: request.requestTypeId,
    };

    await this.sendNotification(request.user, data);
  }

  private async sendNotification(
    user: User,
    data: NotificationSenderForTechnicalUserDto,
  ) {
    const persianDate = await this.persianDateRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.col('GregorianDate'), {
            [Op.eq]: Sequelize.literal(
              `'${moment(data.date).format('YYYY-MM-DD')}'`,
            ),
          }),
        )
        .build(),
    );
    await this.clientTechnicalUserVisitRequestSmsSenderQueue.add(
      'send-client-technical-user-visit-request-sms',
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phoneNumber: user.phoneNumber,
        date: persianDate.DayNameInYear,
        time: data.time,
        requestTypeId: data.requestTypeId,
      },
    );
  }
}
