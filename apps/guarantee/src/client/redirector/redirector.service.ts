import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { SadadRedirectorDto } from './dto';

@Injectable()
export class RedirectorService {
  constructor() {}
  async sadadRedirector(dto: SadadRedirectorDto, res: Response) {
    const html = `
      <html>
        <head>
          <title>Redirect</title>
          <meta name="referrer" content="origin">
        </head>
        <body>
          <form method="GET" action="https://sadad.shaparak.ir/Purchase/Index">
            <input type="hidden" name="token" value="${dto.token}" />
          </form>
          <script>
            document.forms[0].submit();
          </script>
        </body>
      </html>
    `;

    // Set headers to enforce Referrer Policy
    res.set('Content-Type', 'text/html');
    res.set('Referrer-Policy', 'origin');

    res.send(html);
  }
}
