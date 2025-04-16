import { Injectable, Redirect } from '@nestjs/common';
import { SadadRedirectorDto } from './dto';

import * as _ from 'lodash';
import { Response } from 'express';

@Injectable()
export class RedirectorService {
  constructor() {}
  async sadadRedirector(dto: SadadRedirectorDto, res: Response) {
    res.redirect(
      `https://sadad.shaparak.ir/Purchase/Index?token=${dto.token}`,
      302,
    );
  }
}
