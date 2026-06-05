import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { LogisticCancellOrderModule } from './logistic-cancell-order.module';
import {
  seedBase,
  seedCancellOrder,
  cleanupBase,
  cleanupOrderData,
  SeedIds,
} from '../logistic-test-seed';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)(
  'Logistic-Cancell-Orders (e2e)',
  () => {
    let app: NestExpressApplication;
    let ids: SeedIds;
    let logisticOrderId: number;

    beforeAll(async () => {
      app = await createE2EApp({
        imports: [LogisticCancellOrderModule],
      });
      ids = await seedBase();
      const result = await seedCancellOrder(ids);
      logisticOrderId = result.logisticOrderId;
    });

    afterAll(async () => {
      if (app) {
        await cleanupOrderData([logisticOrderId]);
        await cleanupBase(ids);
        await app.close();
      }
    });

    describe('GET /v1/api/ecommerce/admin/logistic/cancellOrders', () => {
      it('should return 200 with paginated list of cancelled orders', async () => {
        const res = await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logistic/cancellOrders?limit=10')
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty('result');
        expect(res.body).toHaveProperty('total');
        expect(Array.isArray(res.body.result)).toBe(true);
        expect(res.body.total).toBeGreaterThanOrEqual(1);

        const order = res.body.result.find(
          (o) => Number(o.id) === logisticOrderId,
        );
        expect(order).toBeDefined();
        expect(order).toHaveProperty('orderStatus');
        expect(order).toHaveProperty('user');
        expect(order).toHaveProperty('address');
        expect(order).toHaveProperty('groups');
        expect(Array.isArray(order.groups)).toBe(true);
      });

      it('should fail with 403 if no auth token', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logistic/cancellOrders')
          .expect(403);
      });
    });

    describe('GET /v1/api/ecommerce/admin/logistic/cancellOrders/:id', () => {
      it('should return single cancelled order by id', async () => {
        const res = await request(app.getHttpServer())
          .get(
            `/v1/api/ecommerce/admin/logistic/cancellOrders/${logisticOrderId}`,
          )
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty('result');
        expect(Number(res.body.result.id)).toBe(logisticOrderId);
        expect(res.body.result).toHaveProperty('groups');
        expect(res.body.result).toHaveProperty('user');
        expect(res.body.result).toHaveProperty('address');
        expect(res.body.result).toHaveProperty('orderStatus');
      });

      it('should return 404 for non-existent id', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logistic/cancellOrders/999999999')
          .set(authHeader())
          .expect(404);
      });

      it('should fail with 403 if no auth token', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logistic/cancellOrders/1')
          .expect(403);
      });
    });
  },
);
