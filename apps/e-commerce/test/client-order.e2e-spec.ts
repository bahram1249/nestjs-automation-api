import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LogisticClientOrderModule } from '../src/client/order/client-order.module';
import { createEcommerceE2EApp } from './utils/e2e-utils';

const isMssql = (process.env.DB_DIALECT || '').toLowerCase() === 'mssql';
const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(isMssql && hasDbConfig ? describe : describe.skip)(
  'ClientOrder (e2e) - real DB',
  () => {
    let app: INestApplication;

    beforeAll(async () => {
      app = await createEcommerceE2EApp({
        imports: [LogisticClientOrderModule],
      });
    });

    afterAll(async () => {
      try {
        await app?.close();
      } catch (e) {
        // swallow shutdown errors in tests to avoid suite failure
      }
    });

    const authHeader = (token = 'test-token') => ({
      Authorization: `Bearer ${token}`,
      'Accept-Language': 'en',
    });

    it('GET /api/ecommerce/client/basedLogistic/orders should return list wrapper (requires token)', async () => {
      const res = await request(app.getHttpServer())
        .get(
          '/api/ecommerce/client/basedLogistic/orders/?filter[offset]=0&filter[limit]=10&filter[orderBy]=ECLogisticOrder.id&filter[sortOrder]=DESC',
        )
        .set(authHeader())
        .expect(200);

      // Interceptor-wrapped response
      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(typeof res.body.total).toBe('number');
    });

    it('GET /api/ecommerce/client/basedLogistic/orders/:id should 404 for non-existent id (requires token)', async () => {
      await request(app.getHttpServer())
        .get('/api/ecommerce/client/basedLogistic/orders/0')
        .set(authHeader('custom-token-123'))
        .expect(404);
    });

    it('should fail with 403 if token missing', async () => {
      await request(app.getHttpServer())
        .get('/api/ecommerce/client/basedLogistic/orders/')
        // intentionally no Authorization header
        .expect(403);
    });
  },
);
