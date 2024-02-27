import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ChobokanRealIpMiddleware implements NestMiddleware {
  constructor(private config: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['x-real-ip'] != null) {
      req.ips.push(req.headers['x-real-ip'].toString());
    } else if (req.headers['x-forwarded-for'] != null) {
      req.ips.push(req.headers['x-forwarded-for'].toString());
    }
    next();
  }
}
