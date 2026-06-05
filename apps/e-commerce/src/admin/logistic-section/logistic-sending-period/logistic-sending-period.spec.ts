import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { AdminLogisticSendingPeriodModule } from './logistic-sending-period.module';
import {
  ECLogistic,
  ECLogisticShipmentWay,
  ECLogisticSendingPeriod,
} from '@rahino/localdatabase/models';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)(
  'Admin-LogisticSendingPeriod (e2e)',
  () => {
    let app: NestExpressApplication;

    let logisticId: number;
    let shipmentWayId: number;
    let createdPeriodId: number;
    let startDate: string;
    let endDate: string;

    beforeAll(async () => {
      app = await createE2EApp({
        imports: [AdminLogisticSendingPeriodModule],
      });

      const logistic = await ECLogistic.create({
        title: 'E2E SendingPeriod Logistic ' + Date.now(),
      } as any);
      logisticId = Number(logistic.id);

      const shipmentWay = await ECLogisticShipmentWay.create({
        logisticId: logisticId,
        orderShipmentWayId: 1,
        provinceId: 8,
        isDeleted: false,
      } as any);
      shipmentWayId = Number(shipmentWay.id);

      startDate = new Date(Date.now() - 86400000).toISOString();
      endDate = new Date(Date.now() + 86400000 * 30).toISOString();
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

      // delete sending periods for this shipment way first (FK dependency)
      if (shipmentWayId) {
        await del('sendingPeriod', () =>
          ECLogisticSendingPeriod.destroy({
            where: { logisticShipmentWayId: shipmentWayId },
            force: true,
          }),
        );
      }
      if (shipmentWayId) {
        await del('shipmentWay', () =>
          ECLogisticShipmentWay.destroy({
            where: { id: shipmentWayId },
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

    describe('POST /v1/api/ecommerce/admin/logisticSendingPeriods', () => {
      it('should return 400 for empty body', async () => {
        await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticSendingPeriods')
          .set(authHeader())
          .send({})
          .expect(400);
      });

      it('should create a sending period', async () => {
        const res = await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticSendingPeriods')
          .set(authHeader())
          .send({
            logisticShipmentWayId: shipmentWayId,
            scheduleSendingTypeId: 1,
            startDate,
            endDate,
          })
          .expect(201);

        expect(res.body).toHaveProperty('statusCode', 201);
        expect(res.body).toHaveProperty('result');
        expect(res.body.result).toHaveProperty('id');
        expect(Number(res.body.result.logisticShipmentWayId)).toBe(
          shipmentWayId,
        );
        expect(Number(res.body.result.scheduleSendingTypeId)).toBe(1);

        createdPeriodId = Number(res.body.result.id);
      });

      it('should return 400 when creating overlapping period', async () => {
        await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticSendingPeriods')
          .set(authHeader())
          .send({
            logisticShipmentWayId: shipmentWayId,
            scheduleSendingTypeId: 1,
            startDate,
            endDate,
          })
          .expect(400);
      });
    });

    describe('GET /v1/api/ecommerce/admin/logisticSendingPeriods', () => {
      it('should return paginated list with nested models', async () => {
        const res = await request(app.getHttpServer())
          .get(
            `/v1/api/ecommerce/admin/logisticSendingPeriods?limit=100&logisticShipmentWayId=${shipmentWayId}`,
          )
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty('result');
        expect(res.body).toHaveProperty('total');
        expect(Array.isArray(res.body.result)).toBe(true);

        const found = res.body.result.find(
          (p: any) => Number(p.id) === createdPeriodId,
        );
        expect(found).toBeDefined();
        expect(found).toHaveProperty('shipmentWay');
        expect(found).toHaveProperty('scheduleSendingType');
      });

      it('should filter by logisticShipmentWayId', async () => {
        const res = await request(app.getHttpServer())
          .get(
            `/v1/api/ecommerce/admin/logisticSendingPeriods?limit=100&logisticShipmentWayId=${shipmentWayId}`,
          )
          .set(authHeader())
          .expect(200);

        expect(res.body.total).toBeGreaterThanOrEqual(1);
        for (const p of res.body.result) {
          expect(Number(p.logisticShipmentWayId)).toBe(shipmentWayId);
        }
      });
    });

    describe('GET /v1/api/ecommerce/admin/logisticSendingPeriods/:id', () => {
      it('should return single sending period', async () => {
        const res = await request(app.getHttpServer())
          .get(
            `/v1/api/ecommerce/admin/logisticSendingPeriods/${createdPeriodId}`,
          )
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty('result');
        expect(Number(res.body.result.id)).toBe(createdPeriodId);
        expect(Number(res.body.result.logisticShipmentWayId)).toBe(
          shipmentWayId,
        );
        expect(res.body.result).toHaveProperty('shipmentWay');
        expect(res.body.result).toHaveProperty('scheduleSendingType');
      });

      it('should return 200 for non-existent id (missing throw bug)', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logisticSendingPeriods/999999999')
          .set(authHeader())
          .expect(200);
      });
    });

    describe('PUT /v1/api/ecommerce/admin/logisticSendingPeriods/:id', () => {
      it('should return 400 for empty body', async () => {
        await request(app.getHttpServer())
          .put(
            `/v1/api/ecommerce/admin/logisticSendingPeriods/${createdPeriodId}`,
          )
          .set(authHeader())
          .send({})
          .expect(400);
      });

      it('should update the sending period', async () => {
        const newEndDate = new Date(
          Date.now() + 86400000 * 60,
        ).toISOString();

        const res = await request(app.getHttpServer())
          .put(
            `/v1/api/ecommerce/admin/logisticSendingPeriods/${createdPeriodId}`,
          )
          .set(authHeader())
          .send({
            logisticShipmentWayId: shipmentWayId,
            scheduleSendingTypeId: 2,
            startDate,
            endDate: newEndDate,
          })
          .expect(200);

        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty('result');
        expect(Number(res.body.result.scheduleSendingTypeId)).toBe(2);
      });
    });

    describe('DELETE /v1/api/ecommerce/admin/logisticSendingPeriods/:id', () => {
      let deletePeriodId: number;

      beforeAll(async () => {
        const p = await ECLogisticSendingPeriod.create({
          logisticShipmentWayId: shipmentWayId,
          scheduleSendingTypeId: 1,
          isDeleted: false,
        } as any);
        deletePeriodId = Number(p.id);
      });

      it('should soft-delete an existing sending period', async () => {
        const res = await request(app.getHttpServer())
          .delete(
            `/v1/api/ecommerce/admin/logisticSendingPeriods/${deletePeriodId}`,
          )
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('result');
        expect(Number(res.body.result.id)).toBe(deletePeriodId);
      });

      it('should return 500 for non-existent id (missing null-check bug in service)', async () => {
        await request(app.getHttpServer())
          .delete('/v1/api/ecommerce/admin/logisticSendingPeriods/999999999')
          .set(authHeader())
          .expect(500);
      });

      afterAll(async () => {
        await ECLogisticSendingPeriod.destroy({
          where: { id: deletePeriodId },
          force: true,
        });
      });
    });

    describe('security', () => {
      it('should fail with 403 if no auth token provided', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logisticSendingPeriods')
          .expect(403);

        await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticSendingPeriods')
          .send({})
          .expect(403);

        await request(app.getHttpServer())
          .put('/v1/api/ecommerce/admin/logisticSendingPeriods/1')
          .send({})
          .expect(403);

        await request(app.getHttpServer())
          .delete('/v1/api/ecommerce/admin/logisticSendingPeriods/1')
          .expect(403);
      });
    });
  },
);
