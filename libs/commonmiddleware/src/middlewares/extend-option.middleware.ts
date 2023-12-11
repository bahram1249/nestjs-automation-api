import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ExtendOptionMiddleware implements NestMiddleware {
  constructor(private config: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    req.sitename = this.config.get('SITE_NAME');
    next();
  }
}
