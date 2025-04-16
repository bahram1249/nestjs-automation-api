import { Injectable, Redirect } from '@nestjs/common';
import { SadadRedirectorDto } from './dto';

import * as _ from 'lodash';

@Injectable()
export class RedirectorService {
  constructor() {}
  async sadadRedirector(dto: SadadRedirectorDto) {
    return Redirect(
      `https://sadad.shaparak.ir/Purchase/Index?token=${dto.token}`,
      302,
    );
  }
}
