import { Controller, Get, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  @MessagePattern('notify')
  async notify(data: NotifiyData) {
    console.log('send');
    Logger.log('notificatoin data' + data.user);
    let a: number = data.data['a'];
    let b: number = data.data['b'];
    console.log(a, b);
    return a + b;
  }
}
