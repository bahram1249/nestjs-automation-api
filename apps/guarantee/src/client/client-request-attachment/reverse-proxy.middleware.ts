import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ReverseProxyGuaranteeRequestMiddleware implements NestMiddleware {
  constructor(private readonly config: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    const proxyMiddleware = createProxyMiddleware({
      target:
        'https://' + this.config.get<string>('MINIO_ENDPOINT') + '/requests', // target host
      changeOrigin: true,
      pathRewrite: {
        '/v1/api/guarantee/cartable/requestAttachments/image/': '',
      },
      onProxyReq: (proxyReq, req, res) => {
        // console.log(
        //   `[NestMiddleware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`,
        // );
      },
    });
    proxyMiddleware(req, res, next);
  }
}
