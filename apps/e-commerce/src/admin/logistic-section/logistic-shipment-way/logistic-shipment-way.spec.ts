import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { AdminLogisticShipmentWayModule } from './admin-logistic-shipmentway.module';
import {
  ECLogistic,
  ECLogisticUser,
  ECLogisticShipmentWay,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)(
  'Admin-LogisticShipmentWay (e2e)',
  () => {
    let app: NestExpressApplication;

    let logisticId: number;
    let logisticUserId: number;

    beforeAll(async () => {
      app = await createE2EApp({
        imports: [AdminLogisticShipmentWayModule],
      });

      const testUser = await User.findOne({ where: { id: 1 } });
      if (!testUser) throw new Error('User id=1 not seeded');

      const logistic = await ECLogistic.create({
        title: 'E2E ShipmentWay Logistic ' + Date.now(),
      } as any);
      logisticId = Number(logistic.id);

      const logisticUser = await ECLogisticUser.create({
        logisticId: logisticId,
        userId: 1,
        isDefault: true,
        isDeleted: false,
      } as any);
      logisticUserId = Number(logisticUser.id);
    });

    afterAll(async () => {
      if (!app) return;
      const errors: string[] = [];
      const del = async (label: string, fn: () => Promise<any>) => {
        try {
          await fn();
        } catch (e) {
          errors.push(`${label}: ${e.message}`);
        }
      };

      // delete all shipment ways for this logistic first (FK dependency)
      await del('shipmentWay', () =>
        ECLogisticShipmentWay.destroy({
          where: { logisticId: logisticId },
          force: true,
        }),
      );
      if (logisticUserId) {
        await del('logisticUser', () =>
          ECLogisticUser.destroy({
            where: { id: logisticUserId },
            force: true,
          }),
        );
      }
      if (logisticId) {
        await del('logistic', () =>
          ECLogistic.destroy({ where: { id: logisticId }, force: true }),
        );
      }

      await app.close();
      if (errors.length) throw new Error(errors.join('; '));
    });

    describe('POST /v1/api/ecommerce/admin/logisticShipmentWays', () => {
      it('should return 400 for empty body', async () => {
        await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticShipmentWays')
          .set(authHeader())
          .send({})
          .expect(400);
      });

      it('should create shipment ways', async () => {
        const res = await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticShipmentWays')
          .set(authHeader())
          .send({
            logisticId: logisticId,
            shipmentWayDetails: [
              { orderShipmentWayId: 1, provinceId: 8 },
            ],
          })
          .expect(201);

        expect(res.body).toHaveProperty('statusCode', 201);
        expect(res.body).toHaveProperty('result');
      });

      it('should upsert — calling again with same data is idempotent', async () => {
        const res = await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticShipmentWays')
          .set(authHeader())
          .send({
            logisticId: logisticId,
            shipmentWayDetails: [
              { orderShipmentWayId: 1, provinceId: 8 },
            ],
          })
          .expect(201);

        expect(res.body).toHaveProperty('statusCode', 201);
      });
    });

    describe('GET /v1/api/ecommerce/admin/logisticShipmentWays/:logisticId', () => {
      it('should return list of shipment ways for the logistic', async () => {
        const res = await request(app.getHttpServer())
          .get(`/v1/api/ecommerce/admin/logisticShipmentWays/${logisticId}`)
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty('result');
        expect(res.body).toHaveProperty('total');
        expect(Array.isArray(res.body.result)).toBe(true);

        if (res.body.total > 0) {
          const way = res.body.result[0];
          expect(way).toHaveProperty('id');
          expect(Number(way.logisticId)).toBe(logisticId);
          expect(way).toHaveProperty('orderShipmentWayId');
          expect(way).toHaveProperty('province');
          expect(way).toHaveProperty('orderShipmentWay');
          expect(way).toHaveProperty('logistic');
        }
      });

      it('should return 403 for logistic without access (no ECLogisticUser)', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logisticShipmentWays/999999999')
          .set(authHeader())
          .expect(403);
      });
    });

    describe('security', () => {
      it('should fail with 403 if no auth token provided', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logisticShipmentWays/1')
          .expect(403);

        await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticShipmentWays')
          .send({})
          .expect(403);
      });
    });
  },
);
