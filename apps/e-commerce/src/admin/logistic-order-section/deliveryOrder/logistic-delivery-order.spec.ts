import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { LogisticDeliveryOrderModule } from './logistic-delivery-order.module';
import {
  seedBase,
  seedDeliveryOrder,
  cleanupBase,
  cleanupOrderData,
  SeedIds,
} from '../logistic-test-seed';
import { OrderStatusEnum } from '@rahino/ecommerce/shared/enum';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)(
  'Logistic-Delivery-Orders (e2e)',
  () => {
    let app: NestExpressApplication;
    let ids: SeedIds;
    let logisticOrderId: number;
    let groupedId: number;

    beforeAll(async () => {
      app = await createE2EApp({
        imports: [LogisticDeliveryOrderModule],
      });
      ids = await seedBase();
      const result = await seedDeliveryOrder(ids);
      logisticOrderId = result.logisticOrderId;
      groupedId = result.groupedId;
    });

    afterAll(async () => {
      if (app) {
        await cleanupOrderData([logisticOrderId]);
        await cleanupBase(ids);
        await app.close();
      }
    });

    describe('GET /v1/api/ecommerce/admin/logistic/deliveryOrders', () => {
      it('should return 200 with paginated list of delivery orders', async () => {
        const res = await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logistic/deliveryOrders?limit=10')
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
        expect(Number(group.orderStatusId)).toBe(OrderStatusEnum.SendByCourier);
      });

      it('should fail with 403 if no auth token', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logistic/deliveryOrders')
          .expect(403);
      });
    });

    describe('GET /v1/api/ecommerce/admin/logistic/deliveryOrders/:id', () => {
      it('should return single delivery order by id', async () => {
        const res = await request(app.getHttpServer())
          .get(
            `/v1/api/ecommerce/admin/logistic/deliveryOrders/${logisticOrderId}`,
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
          .get('/v1/api/ecommerce/admin/logistic/deliveryOrders/999999999')
          .set(authHeader())
          .expect(404);
      });

      it('should fail with 403 if no auth token', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logistic/deliveryOrders/1')
          .expect(403);
      });
    });

    describe('PATCH /v1/api/ecommerce/admin/logistic/deliveryOrders/processDelivery/:id', () => {
      it('should mark group as delivered to customer', async () => {
        const res = await request(app.getHttpServer())
          .patch(
            `/v1/api/ecommerce/admin/logistic/deliveryOrders/processDelivery/${groupedId}`,
          )
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('result');
        expect(Number(res.body.result.id)).toBe(groupedId);
        expect(Number(res.body.result.orderStatusId)).toBe(
          OrderStatusEnum.DeliveredToTheCustomer,
        );
        expect(res.body.result).toHaveProperty('sendToCustomerDate');
      });

      it('should return 404 for non-existent group id', async () => {
        await request(app.getHttpServer())
          .patch(
            '/v1/api/ecommerce/admin/logistic/deliveryOrders/processDelivery/999999999',
          )
          .set(authHeader())
          .expect(404);
      });

      it('should fail with 403 if no auth token', async () => {
        await request(app.getHttpServer())
          .patch(
            '/v1/api/ecommerce/admin/logistic/deliveryOrders/processDelivery/1',
          )
          .expect(403);
      });
    });
  },
);
