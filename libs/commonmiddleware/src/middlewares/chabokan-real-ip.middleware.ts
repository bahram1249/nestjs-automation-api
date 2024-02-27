import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ChobokanRealIpMiddleware implements NestMiddleware {
  constructor(private config: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['REAL_IP'] != null) {
      req.ips.push(req.headers['REAL_IP'].toString());
    } else if (req.headers['REMOTE_ADDR'] != null) {
      req.ips.push(req.headers['REMOTE_ADDR'].toString());
    }
    next();
  }
}
