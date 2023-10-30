import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class DBLogger extends ConsoleLogger {
  error(message: any, payload?: any, context?: string) {
    // add your tailored logic here
    console.log(payload);
    super.error(message);
  }
}
