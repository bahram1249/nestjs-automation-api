import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { AdminLogisticUserModule } from './admin-logistic-user.module';
import { ECLogistic, ECLogisticUser } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)('Admin-LogisticUser (e2e)', () => {
  let app: NestExpressApplication;

  let logisticId: number;
  let logisticUserId: number;

  beforeAll(async () => {
    app = await createE2EApp({
      imports: [AdminLogisticUserModule],
    });

    const testUser = await User.findOne({ where: { id: 1 } });
    if (!testUser) throw new Error('User id=1 not seeded');

    const logistic = await ECLogistic.create({
      title: 'E2E LogisticUser Logistic ' + Date.now(),
    } as any);
    logisticId = Number(logistic.id);
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

    if (logisticId) {
      // delete all logistic users for this logistic first (FK dependency)
      await del('logisticUser', () =>
        ECLogisticUser.destroy({
          where: { logisticId: logisticId },
          force: true,
        }),
      );
      await del('logistic', () =>
        ECLogistic.destroy({ where: { id: logisticId }, force: true }),
      );
    }

    await app.close();
    if (errors.length) throw new Error(errors.join('; '));
  });

  describe('POST /v1/api/ecommerce/admin/logisticUsers', () => {
    const userPhone = '88' + Date.now().toString().slice(-8);

    it('should return 400 for empty body', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/logisticUsers')
        .set(authHeader())
        .send({})
        .expect(400);
    });

    it('should create a logistic user', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/logisticUsers')
        .set(authHeader())
        .send({
          logisticId: logisticId,
          firstname: 'E2E',
          lastname: 'LUU',
          phoneNumber: userPhone,
        })
        .expect(201);

      expect(res.body).toHaveProperty('statusCode', 201);
      expect(res.body).toHaveProperty('result');
    });
  });

  describe('GET /v1/api/ecommerce/admin/logisticUsers/:logisticId', () => {
    beforeAll(async () => {
      // seed a logistic user for this logistic so GET has data
      const lu = await ECLogisticUser.findOne({
        where: { logisticId: logisticId, isDeleted: false },
      });
      if (!lu) {
        const logisticUser = await ECLogisticUser.create({
          logisticId: logisticId,
          userId: 1,
          isDefault: true,
          isDeleted: false,
        } as any);
        logisticUserId = Number(logisticUser.id);
      } else {
        logisticUserId = Number(lu.id);
      }
    });

    it('should return list of users for the logistic', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/admin/logisticUsers/${logisticId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.total).toBeGreaterThanOrEqual(1);

      const lu = res.body.result[0];
      expect(lu).toHaveProperty('id');
      expect(lu).toHaveProperty('userId');
      expect(Number(lu.logisticId)).toBe(logisticId);
      expect(lu).toHaveProperty('user');
    });
  });

  describe('DELETE /v1/api/ecommerce/admin/logisticUsers/:id', () => {
    let deleteLogisticUserId: number;
    let createdUserId: number;

    beforeAll(async () => {
      const delPhone = '77' + Date.now().toString().slice(-8);
      const user = await User.create({
        firstname: 'Del',
        lastname: 'LU',
        phoneNumber: delPhone,
      } as any);
      createdUserId = Number(user.id);

      const logisticUser = await ECLogisticUser.create({
        logisticId: logisticId,
        userId: Number(user.id),
        isDefault: false,
        isDeleted: false,
      } as any);
      deleteLogisticUserId = Number(logisticUser.id);
    });

    it('should delete a non-default logistic user (soft-delete)', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/v1/api/ecommerce/admin/logisticUsers/${deleteLogisticUserId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
    });

    it('should return 400 for non-existent id', async () => {
      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/admin/logisticUsers/999999999')
        .set(authHeader())
        .expect(400);
    });

    afterAll(async () => {
      await ECLogisticUser.destroy({
        where: { id: deleteLogisticUserId },
        force: true,
      });
      if (createdUserId) {
        await User.destroy({ where: { id: createdUserId }, force: true });
      }
    });
  });

  describe('security', () => {
    it('should fail with 403 if no auth token provided', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/logisticUsers/1')
        .expect(403);

      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/logisticUsers')
        .send({})
        .expect(403);

      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/admin/logisticUsers/1')
        .expect(403);
    });
  });
});
