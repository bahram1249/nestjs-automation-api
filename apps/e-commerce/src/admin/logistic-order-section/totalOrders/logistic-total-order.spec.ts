import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { LogisticTotalOrderModule } from './logistic-total-order.module';
import {
  seedBase,
  seedTotalOrder,
  cleanupBase,
  cleanupOrderData,
  SeedIds,
} from '../logistic-test-seed';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
} from '@rahino/localdatabase/models';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)('Logistic-Total-Orders (e2e)', () => {
  let app: NestExpressApplication;
  let ids: SeedIds;
  let logisticOrderId: number;
  let groupedId: number;
  let detailId: number;

  beforeAll(async () => {
    app = await createE2EApp({
      imports: [LogisticTotalOrderModule],
    });
    ids = await seedBase();
    const result = await seedTotalOrder(ids);
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

  describe('GET /v1/api/ecommerce/admin/logistic/totalOrders', () => {
    it('should return 200 with paginated list of all logistic orders', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/logistic/totalOrders?limit=10')
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
      expect(order).toHaveProperty('address');
      expect(order).toHaveProperty('user');

      const group = order.groups.find((g) => Number(g.id) === groupedId);
      expect(group).toBeDefined();
      expect(group).toHaveProperty('details');
    });

    it('should search by phone number', async () => {
      const res = await request(app.getHttpServer())
        .get(
          '/v1/api/ecommerce/admin/logistic/totalOrders?limit=10&phoneNumber=%',
        )
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(Array.isArray(res.body.result)).toBe(true);
    });

    it('should fail with 403 if no auth token', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/logistic/totalOrders')
        .expect(403);
    });
  });

  describe('GET /v1/api/ecommerce/admin/logistic/totalOrders/:id', () => {
    it('should return single total order by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/admin/logistic/totalOrders/${logisticOrderId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(Number(res.body.result.id)).toBe(logisticOrderId);
      expect(res.body.result).toHaveProperty('groups');
      expect(res.body.result).toHaveProperty('address');
      expect(res.body.result).toHaveProperty('user');
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/logistic/totalOrders/999999999')
        .set(authHeader())
        .expect(404);
    });

    it('should fail with 403 if no auth token', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/logistic/totalOrders/1')
        .expect(403);
    });
  });

  describe('PATCH /v1/api/ecommerce/admin/logistic/totalOrders/changeShipmentWay/:id', () => {
    it('should update shipment way for a group', async () => {
      const res = await request(app.getHttpServer())
        .patch(
          `/v1/api/ecommerce/admin/logistic/totalOrders/changeShipmentWay/${groupedId}`,
        )
        .set(authHeader())
        .send({ orderShipmentWayId: 1 })
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(Number(res.body.result.id)).toBe(groupedId);
    });

    it('should return 404 for non-existent group id', async () => {
      await request(app.getHttpServer())
        .patch(
          '/v1/api/ecommerce/admin/logistic/totalOrders/changeShipmentWay/999999999',
        )
        .set(authHeader())
        .send({ orderShipmentWayId: 1 })
        .expect(404);
    });

    it('should fail with 403 if no auth token', async () => {
      await request(app.getHttpServer())
        .patch(
          '/v1/api/ecommerce/admin/logistic/totalOrders/changeShipmentWay/1',
        )
        .send({ orderShipmentWayId: 1 })
        .expect(403);
    });
  });

  describe('PATCH /v1/api/ecommerce/admin/logistic/totalOrders/changeOrderStatus/:id', () => {
    it('should update order status for a group', async () => {
      const res = await request(app.getHttpServer())
        .patch(
          `/v1/api/ecommerce/admin/logistic/totalOrders/changeOrderStatus/${groupedId}`,
        )
        .set(authHeader())
        .send({ orderStatusId: 4 })
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(Number(res.body.result.id)).toBe(groupedId);
      expect(Number(res.body.result.orderStatusId)).toBe(4);
    });

    it('should return 404 for non-existent group id', async () => {
      await request(app.getHttpServer())
        .patch(
          '/v1/api/ecommerce/admin/logistic/totalOrders/changeOrderStatus/999999999',
        )
        .set(authHeader())
        .send({ orderStatusId: 4 })
        .expect(404);
    });

    it('should fail with 403 if no auth token', async () => {
      await request(app.getHttpServer())
        .patch(
          '/v1/api/ecommerce/admin/logistic/totalOrders/changeOrderStatus/1',
        )
        .send({ orderStatusId: 4 })
        .expect(403);
    });
  });

  describe('PATCH /v1/api/ecommerce/admin/logistic/totalOrders/editReceiptPost/:id', () => {
    it('should update receipt post for a group', async () => {
      const res = await request(app.getHttpServer())
        .patch(
          `/v1/api/ecommerce/admin/logistic/totalOrders/editReceiptPost/${groupedId}`,
        )
        .set(authHeader())
        .send({ receipt: 'RECEIPT-12345' })
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(Number(res.body.result.id)).toBe(groupedId);
    });

    it('should return 404 for non-existent group id', async () => {
      await request(app.getHttpServer())
        .patch(
          '/v1/api/ecommerce/admin/logistic/totalOrders/editReceiptPost/999999999',
        )
        .set(authHeader())
        .send({ receipt: 'RECEIPT-12345' })
        .expect(404);
    });

    it('should fail with 403 if no auth token', async () => {
      await request(app.getHttpServer())
        .patch('/v1/api/ecommerce/admin/logistic/totalOrders/editReceiptPost/1')
        .send({ receipt: 'RECEIPT-12345' })
        .expect(403);
    });
  });

  describe('DELETE /v1/api/ecommerce/admin/logistic/totalOrders/removeDetail/:id', () => {
    it('should soft-delete a detail from a logistic order', async () => {
      const res = await request(app.getHttpServer())
        .delete(
          `/v1/api/ecommerce/admin/logistic/totalOrders/removeDetail/${detailId}`,
        )
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(res.body.result).toBe('ok');
    });

    it('should return 404 for non-existent detail id', async () => {
      await request(app.getHttpServer())
        .delete(
          '/v1/api/ecommerce/admin/logistic/totalOrders/removeDetail/999999999',
        )
        .set(authHeader())
        .expect(404);
    });

    it('should fail with 403 if no auth token', async () => {
      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/admin/logistic/totalOrders/removeDetail/1')
        .expect(403);
    });
  });

  describe('DELETE /v1/api/ecommerce/admin/logistic/totalOrders/decreaseDetail/:id', () => {
    let storedDecreaseIds: number[];
    let freshDetailId: number;

    beforeAll(async () => {
      const order = await ECLogisticOrder.create({
        orderStatusId: 2,
        sessionId: 'test-decrease',
        userId: 1,
        addressId: ids.addressId,
      } as any);
      const group = await ECLogisticOrderGrouped.create({
        logisticOrderId: Number(order.id),
        logisticId: ids.logisticId,
        logisticShipmentWayId: ids.logisticShipmentWayDeliveryId,
        orderStatusId: 2,
        orderShipmentWayId: 2,
      } as any);
      const detail = await ECLogisticOrderGroupedDetail.create({
        groupedId: Number(group.id),
        orderDetailStatusId: 2,
        vendorId: ids.vendorId,
        productId: ids.productId,
        inventoryId: ids.inventoryId,
        inventoryPriceId: ids.inventoryPriceId,
        qty: 5,
        productPrice: 100000,
        totalPrice: 500000,
      } as any);
      freshDetailId = Number(detail.id);

      storedDecreaseIds = [Number(order.id)];
    });

    afterAll(async () => {
      if (app && storedDecreaseIds) {
        await cleanupOrderData(storedDecreaseIds);
      }
    });

    it('should decrease qty by 1', async () => {
      const res = await request(app.getHttpServer())
        .delete(
          `/v1/api/ecommerce/admin/logistic/totalOrders/decreaseDetail/${freshDetailId}`,
        )
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(res.body.result).toBe('ok');
    });

    it('should return 404 for non-existent detail id', async () => {
      await request(app.getHttpServer())
        .delete(
          '/v1/api/ecommerce/admin/logistic/totalOrders/decreaseDetail/999999999',
        )
        .set(authHeader())
        .expect(404);
    });

    it('should fail with 403 if no auth token', async () => {
      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/admin/logistic/totalOrders/decreaseDetail/1')
        .expect(403);
    });
  });

  describe('DELETE /v1/api/ecommerce/admin/logistic/totalOrders/:id', () => {
    let freshOrderId: number;

    beforeAll(async () => {
      const order = await ECLogisticOrder.create({
        orderStatusId: 2,
        sessionId: 'test-delete-order',
        userId: 1,
        addressId: ids.addressId,
      } as any);
      freshOrderId = Number(order.id);
    });

    afterAll(async () => {
      if (app) {
        await cleanupOrderData([freshOrderId]);
      }
    });

    it('should soft-delete an entire logistic order', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/v1/api/ecommerce/admin/logistic/totalOrders/${freshOrderId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(res.body.result).toBe('ok');
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/admin/logistic/totalOrders/999999999')
        .set(authHeader())
        .expect(404);
    });

    it('should fail with 403 if no auth token', async () => {
      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/admin/logistic/totalOrders/1')
        .expect(403);
    });
  });
});
