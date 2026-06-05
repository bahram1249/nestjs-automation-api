import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { LogisticPendingOrderModule } from './logistic-pending-order.module';
import {
  seedBase,
  seedPendingOrder,
  cleanupBase,
  cleanupOrderData,
  SeedIds,
} from '../logistic-test-seed';
import { OrderDetailStatusEnum } from '@rahino/ecommerce/shared/enum';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)(
  'Logistic-Pending-Orders (e2e)',
  () => {
    let app: NestExpressApplication;
    let ids: SeedIds;
    let logisticOrderId: number;
    let groupedId: number;
    let detailId: number;

    beforeAll(async () => {
      app = await createE2EApp({
        imports: [LogisticPendingOrderModule],
      });
      ids = await seedBase();
      const result = await seedPendingOrder(ids);
      logisticOrderId = result.logisticOrderId;
      groupedId = result.groupedId;
      detailId = result.detailId;
    });

    afterAll(async () => {
      if (app) {
        await cleanupOrderData([logisticOrderId]);
        await cleanupBase(ids);
        await app.close();
      }
    });

    describe('GET /v1/api/ecommerce/admin/logistic/pendingOrders', () => {
      it('should return 200 with paginated list of pending orders for vendor', async () => {
        const res = await request(app.getHttpServer())
          .get(
            `/v1/api/ecommerce/admin/logistic/pendingOrders?limit=10&vendorId=${ids.vendorId}`,
          )
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
        expect(order).toHaveProperty('groups');
        const group = order.groups.find((g) => Number(g.id) === groupedId);
        expect(group).toBeDefined();
        expect(group).toHaveProperty('details');
      });

      it('should return 403 when vendorId is not provided', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logistic/pendingOrders?limit=10')
          .set(authHeader())
          .expect(400);
      });

      it('should fail with 403 if no auth token', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logistic/pendingOrders')
          .expect(403);
      });
    });

    describe('GET /v1/api/ecommerce/admin/logistic/pendingOrders/:id', () => {
      it('should return single pending order by id', async () => {
        const res = await request(app.getHttpServer())
          .get(
            `/v1/api/ecommerce/admin/logistic/pendingOrders/${logisticOrderId}?vendorId=${ids.vendorId}`,
          )
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty('result');
        expect(Number(res.body.result.id)).toBe(logisticOrderId);
        expect(res.body.result).toHaveProperty('groups');
      });

      it('should return 404 for non-existent id', async () => {
        await request(app.getHttpServer())
          .get(
            `/v1/api/ecommerce/admin/logistic/pendingOrders/999999999?vendorId=${ids.vendorId}`,
          )
          .set(authHeader())
          .expect(404);
      });

      it('should fail with 403 if no auth token', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logistic/pendingOrders/1')
          .expect(403);
      });
    });

    describe('PATCH /v1/api/ecommerce/admin/logistic/pendingOrders/processDetail/:id', () => {
      it('should mark pending detail as processed', async () => {
        const res = await request(app.getHttpServer())
          .patch(
            `/v1/api/ecommerce/admin/logistic/pendingOrders/processDetail/${detailId}`,
          )
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('result');
        expect(Number(res.body.result.id)).toBe(detailId);
        expect(Number(res.body.result.orderDetailStatusId)).toBe(
          OrderDetailStatusEnum.Processed,
        );
      });

      it('should return 404 for non-existent detail id', async () => {
        await request(app.getHttpServer())
          .patch(
            '/v1/api/ecommerce/admin/logistic/pendingOrders/processDetail/999999999',
          )
          .set(authHeader())
          .expect(404);
      });

      it('should fail with 403 if no auth token', async () => {
        await request(app.getHttpServer())
          .patch(
            '/v1/api/ecommerce/admin/logistic/pendingOrders/processDetail/1',
          )
          .expect(403);
      });
    });
  },
);
