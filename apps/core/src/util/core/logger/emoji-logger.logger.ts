import { LoggerService } from '@nestjs/common';

export class EmojiLogger implements LoggerService {
  log(message: string) {
    this.writeToFile('📢 ' + message);
  }

  error(message: string, trace: string) {
    this.writeToFile('❌ ' + message);
    this.writeToFile('🔍 Stack Trace: ' + trace);
  }

  warn(message: string) {
    this.writeToFile('⚠️ ' + message);
  }

  debug(message: string) {
    this.writeToFile('🐞 ' + message);
  }

  private writeToFile(message: string) {
    // Implement the logic to write logs to a file here.
    console.log(message); // For demonstration purposes, we'll just log to the console.
  }
}
