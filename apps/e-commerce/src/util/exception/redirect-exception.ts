import { HttpException, HttpStatus } from '@nestjs/common';

export class RedirectException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FOUND);
  }
}
