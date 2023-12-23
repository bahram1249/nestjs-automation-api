import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class WebAuthDiscountCoffeMiddleware implements NestMiddleware {
  constructor(private config: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    var token = null;
    if (req.cookies['token']) {
      token = req.cookies['token'];
    }
    if (token == null) {
      return res.redirect(`/login?redirectUrl=${req.url}`);
    }
    next();
  }
}
