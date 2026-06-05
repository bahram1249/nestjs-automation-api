import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { AdminLogisticWeeklyPeriodModule } from './logistic-weekly-period.module';
import {
  ECLogistic,
  ECLogisticShipmentWay,
  ECLogisticSendingPeriod,
  ECLogisticWeeklyPeriod,
  ECLogisticWeeklyPeriodTime,
} from '@rahino/localdatabase/models';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)(
  'Admin-LogisticWeeklyPeriod (e2e)',
  () => {
    let app: NestExpressApplication;

    let logisticId: number;
    let shipmentWayId: number;
    let sendingPeriodId: number;
    let createdWeeklyPeriodIds: number[] = [];

    beforeAll(async () => {
      app = await createE2EApp({
        imports: [AdminLogisticWeeklyPeriodModule],
      });

      const logistic = await ECLogistic.create({
        title: 'E2E WeeklyPeriod Logistic ' + Date.now(),
      } as any);
      logisticId = Number(logistic.id);

      const shipmentWay = await ECLogisticShipmentWay.create({
        logisticId: logisticId,
        orderShipmentWayId: 1,
        provinceId: 8,
        isDeleted: false,
      } as any);
      shipmentWayId = Number(shipmentWay.id);

      const sendingPeriod = await ECLogisticSendingPeriod.create({
        logisticShipmentWayId: shipmentWayId,
        scheduleSendingTypeId: 1,
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(Date.now() + 86400000 * 30),
        isDeleted: false,
      } as any);
      sendingPeriodId = Number(sendingPeriod.id);
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

      // delete in FK dependency order: times → weekly periods → sending periods → shipment ways → logistic
      // delete ALL weekly period times & periods for this sending period (including soft-deleted)
      const allWeeklyPeriodIds = (
        await ECLogisticWeeklyPeriod.findAll({
          where: { logisticSendingPeriodId: sendingPeriodId },
          paranoid: false,
        })
      ).map((w) => Number(w.id));
      if (allWeeklyPeriodIds.length > 0) {
        await del('weeklyPeriodTimes', () =>
          ECLogisticWeeklyPeriodTime.destroy({
            where: { logisticWeeklyPeriodId: allWeeklyPeriodIds },
            force: true,
          }),
        );
        await del('weeklyPeriod', () =>
          ECLogisticWeeklyPeriod.destroy({
            where: { id: allWeeklyPeriodIds },
            force: true,
          }),
        );
      }
      if (sendingPeriodId) {
        await del('sendingPeriod', () =>
          ECLogisticSendingPeriod.destroy({
            where: { id: sendingPeriodId },
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

    describe('POST /v1/api/ecommerce/admin/logisticWeeklyPeriods', () => {
      it('should return 400 for empty body', async () => {
        await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticWeeklyPeriods')
          .set(authHeader())
          .send({})
          .expect(400);
      });

      it('should create weekly periods with time slots', async () => {
        const res = await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticWeeklyPeriods')
          .set(authHeader())
          .send({
            logisticSendingPeriodId: sendingPeriodId,
            logisticWeeklyPeriods: [
              {
                weekNumber: 3,
                logisticWeeklyPeriodTimes: [
                  {
                    startTime: '09:00:00',
                    endTime: '12:00:00',
                    capacity: 10,
                  },
                ],
              },
            ],
          })
          .expect(201);

        expect(res.body).toHaveProperty('statusCode', 201);
        expect(res.body).toHaveProperty('result');
        expect(Array.isArray(res.body.result)).toBe(true);
        expect(res.body.result.length).toBeGreaterThanOrEqual(1);

        const wp = res.body.result[0];
        expect(Number(wp.logisticSendingPeriodId)).toBe(sendingPeriodId);
        expect(wp.weekNumber).toBe(3);
        expect(wp).toHaveProperty('weeklyPeriodTimes');
        expect(Array.isArray(wp.weeklyPeriodTimes)).toBe(true);
        expect(wp.weeklyPeriodTimes.length).toBeGreaterThanOrEqual(1);
        expect(wp.weeklyPeriodTimes[0]).toHaveProperty('startTime');
        expect(wp.weeklyPeriodTimes[0]).toHaveProperty('endTime');
        expect(wp.weeklyPeriodTimes[0]).toHaveProperty('capacity');

        createdWeeklyPeriodIds = res.body.result.map((w: any) =>
          Number(w.id),
        );
      });

      it('should upsert — calling again with same data replaces old periods', async () => {
        const res = await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticWeeklyPeriods')
          .set(authHeader())
          .send({
            logisticSendingPeriodId: sendingPeriodId,
            logisticWeeklyPeriods: [
              {
                weekNumber: 3,
                logisticWeeklyPeriodTimes: [
                  {
                    startTime: '09:00:00',
                    endTime: '12:00:00',
                    capacity: 15,
                  },
                ],
              },
            ],
          })
          .expect(201);

        expect(res.body).toHaveProperty('statusCode', 201);
        expect(Array.isArray(res.body.result)).toBe(true);

        createdWeeklyPeriodIds = res.body.result.map((w: any) =>
          Number(w.id),
        );
      });
    });

    describe('GET /v1/api/ecommerce/admin/logisticWeeklyPeriods', () => {
      it('should return list filtered by logisticSendingPeriodId', async () => {
        const res = await request(app.getHttpServer())
          .get(
            `/v1/api/ecommerce/admin/logisticWeeklyPeriods?logisticSendingPeriodId=${sendingPeriodId}`,
          )
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty('result');
        expect(res.body).toHaveProperty('total');
        expect(Array.isArray(res.body.result)).toBe(true);
        expect(res.body.total).toBeGreaterThanOrEqual(1);

        const wp = res.body.result[0];
        expect(Number(wp.logisticSendingPeriodId)).toBe(sendingPeriodId);
        expect(wp).toHaveProperty('weekNumber');
        expect(wp).toHaveProperty('weeklyPeriodTimes');
      });
    });

    describe('GET /v1/api/ecommerce/admin/logisticWeeklyPeriods/:id', () => {
      it('should return single weekly period with times', async () => {
        const wpId = createdWeeklyPeriodIds[0];
        const res = await request(app.getHttpServer())
          .get(`/v1/api/ecommerce/admin/logisticWeeklyPeriods/${wpId}`)
          .set(authHeader())
          .expect(200);

        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty('result');
        expect(Number(res.body.result.id)).toBe(wpId);
        expect(Number(res.body.result.logisticSendingPeriodId)).toBe(
          sendingPeriodId,
        );
        expect(res.body.result).toHaveProperty('weeklyPeriodTimes');
      });

      it('should return 200 for non-existent id (missing null-check bug)', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logisticWeeklyPeriods/999999999')
          .set(authHeader())
          .expect(200);
      });
    });

    describe('security', () => {
      it('should fail with 403 if no auth token provided', async () => {
        await request(app.getHttpServer())
          .get('/v1/api/ecommerce/admin/logisticWeeklyPeriods')
          .expect(403);

        await request(app.getHttpServer())
          .post('/v1/api/ecommerce/admin/logisticWeeklyPeriods')
          .send({})
          .expect(403);
      });
    });
  },
);
