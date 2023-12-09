import { Injectable, NestMiddleware } from '@nestjs/common';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MenuMiddleware implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    const request: Express.Request = req;
    const user = request.user;
    console.log(user);
    next();
  }
}
