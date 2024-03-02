import { Injectable, Scope } from '@nestjs/common';
import { RequestDataInterface } from '../interface';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ECRequestLog } from '@rahino/database/models/ecommerce-eav/ec-request-log.entity';
import * as moment from 'moment';
import { User } from '@rahino/database/models/core/user.entity';

@Injectable({ scope: Scope.DEFAULT })
export class LoggingService {
  constructor(
    @InjectModel(ECRequestLog)
    private readonly requestLogRepository: typeof ECRequestLog,
  ) {}

  async logRequest(
    requestData: RequestDataInterface,
    session?: ECUserSession,
    user?: User,
  ) {
    const data: any = {
      ip: requestData.ip,
      url: requestData.url,
      method: requestData.method,
      beginTime: moment(requestData.begin).format('YYYY-MM-DD hh:mm:ss.SSS'), //requestData.begin,
      endTime: moment(requestData.end).format('YYYY-MM-DD hh:mm:ss.SSS'),
    };
    if (session) {
      data.sessionId = session.id;
    }
    if (user) {
      data.userId = user.id;
    }
    await this.requestLogRepository.create(data);
  }
}
