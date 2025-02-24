import { Controller, Get, Post } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SellerSyncService } from './seller-sync.service';

@Controller('SellerSync')
export class SellerSyncController {
  constructor(private readonly service: SellerSyncService) {}

  //@Cron(CronExpression.EVERY_5_SECONDS)
  @Post('sync')
  async sync() {
    console.log('was here');
    return await this.service.sync();
  }
}
