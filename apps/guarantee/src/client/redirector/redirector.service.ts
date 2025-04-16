import { Injectable, Redirect } from '@nestjs/common';
import { SadadRedirectorDto } from './dto';

import * as _ from 'lodash';
import { Response } from 'express';

@Injectable()
export class RedirectorService {
  constructor() {}
  async sadadRedirector(dto: SadadRedirectorDto, res: Response) {
    let html = `<html>
      <head>
          <title>Redirect</title>
      </head>
      <body>
        <form method="GET" action="https://sadad.shaparak.ir/Purchase/Index?token=${dto.token}">
        </form> 
        <script>
          window.onload = function(){{
              document.forms[0].submit()
          }}
        </script>
      </body>
    </html>`;
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(html));
  }
}
