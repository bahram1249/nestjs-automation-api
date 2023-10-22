import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('NOTIFY_SERVICE') private readonly client: ClientProxy) {}
  async getHello(): Promise<string> {
    // need to use async because we need to wait recieved data
    let recieve = this.client
      .send<number>('notify', {
        user: 'Ali',
        data: { a: 1, b: 2 },
      })
      .toPromise(); // notify if mapped key will used to in other hand
    // without toPromise function will return Observable and will not see execute before subscribe so when convert to Promise will recieve data in variable

    return '\t add 1+2=' + (await recieve).toString();
  }
}
