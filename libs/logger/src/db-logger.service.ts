import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EmojiLogger } from './emoji-logger.logger';
import { WinstonLog } from '@rahino/database/models/core/winstonlog.entity';

@Injectable()
export class DBLogger extends EmojiLogger {
  constructor(
    @InjectModel(WinstonLog)
    private readonly winstonLogRepository: typeof WinstonLog,
  ) {
    super();
  }
  async error(message: any, stack?: string, context?: string, payload?: any) {
    try {
      await this.winstonLogRepository.create({
        level: 'error',
        message: message,
        meta: JSON.stringify(payload),
      });
    } catch (e: any) {
      super.error(e.message, 'at db-logger.service');
    } finally {
      super.error(message, stack);
    }
  }
}
