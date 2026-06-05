import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { AdminLogisticModule } from './admin-logistic.module';
import {
  ECLogistic,
  ECLogisticUser,
} from '@rahino/localdatabase/models';
import { User, UserRole } from '@rahino/database';
import { getModelToken } from '@nestjs/sequelize';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)('Admin-Logistic (e2e)', () => {
  let app: NestExpressApplication;

  let logisticModel: typeof ECLogistic;
  let logisticUserModel: typeof ECLogisticUser;
  let userModel: typeof User;
  let userRoleModel: typeof UserRole;

  const testTitle = 'E2E Test Logistic ' + Date.now();
  const updatedTitle = 'E2E Updated Logistic ' + Date.now();
  const phoneNumber = '99' + Date.now().toString().slice(-8);
  let createdLogisticId: number;
  let createdLogisticUserId: number;
  let createdUserId: number;

  beforeAll(async () => {
    app = await createE2EApp({
      imports: [AdminLogisticModule],
    });

    logisticModel = app.get<typeof ECLogistic>(getModelToken(ECLogistic));
    logisticUserModel = app.get<typeof ECLogisticUser>(
      getModelToken(ECLogisticUser),
    );
    userModel = app.get<typeof User>(getModelToken(User));
    userRoleModel = app.get<typeof UserRole>(getModelToken(UserRole));

    const testUser = await User.findOne({ where: { id: 1 } });
    if (!testUser) throw new Error('User id=1 not seeded');
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

    if (createdLogisticUserId) {
      await del('logisticUser', () =>
        logisticUserModel.destroy({
          where: { id: createdLogisticUserId },
          force: true,
        }),
      );
    }
    if (createdLogisticId) {
      await del('logistic', () =>
        logisticModel.destroy({
          where: { id: createdLogisticId },
          force: true,
        }),
      );
    }
    if (createdUserId) {
      await del('userRole', () =>
        userRoleModel.destroy({
          where: { userId: createdUserId },
          force: true,
        }),
      );
      await del('user', () =>
        userModel.destroy({
          where: { id: createdUserId },
          force: true,
        }),
      );
    }

    await app.close();
    if (errors.length) throw new Error(errors.join('; '));
  });

  describe('POST /v1/api/ecommerce/admin/logistics', () => {
    it('should return 400 for empty body', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/logistics')
        .set(authHeader())
        .send({})
        .expect(400);
    });

    it('should return 400 when title is too short', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/logistics')
        .set(authHeader())
        .send({
          title: 'ab',
          user: {
            firstname: 'Test',
            lastname: 'User',
            phoneNumber: '98' + Date.now().toString().slice(-8),
          },
        })
        .expect(400);
    });

    it('should return 400 when user fields are missing', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/logistics')
        .set(authHeader())
        .send({ title: 'No User Logistic' })
        .expect(400);
    });

    it('should create a logistic with valid data', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/logistics')
        .set(authHeader())
        .send({
          title: testTitle,
          user: {
            firstname: 'E2E',
            lastname: 'Test',
            phoneNumber: phoneNumber,
          },
        })
        .expect(201);

      expect(res.body).toHaveProperty('statusCode', 201);
      expect(res.body).toHaveProperty('result');
      expect(res.body.result.title).toBe(testTitle);
      expect(res.body.result).toHaveProperty('id');
      expect(res.body.result).toHaveProperty('logisticUser');

      createdLogisticId = Number(res.body.result.id);
      createdLogisticUserId = Number(res.body.result.logisticUser?.id);

      const logisticUser = res.body.result.logisticUser;
      expect(logisticUser.isDefault).toBe(true);
      expect(logisticUser).toHaveProperty('user');
      expect(logisticUser.user.phoneNumber).toBe(phoneNumber);
      createdUserId = Number(logisticUser.user.id);
    });

    it('should return 400 when title already exists', async () => {
      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/logistics')
        .set(authHeader())
        .send({
          title: testTitle,
          user: {
            firstname: 'E2E',
            lastname: 'Test',
            phoneNumber: '97' + Date.now().toString().slice(-8),
          },
        })
        .expect(400);
    });
  });

  describe('GET /v1/api/ecommerce/admin/logistics', () => {
    it('should return paginated list with nested logisticUser', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/logistics?limit=100')
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.total).toBeGreaterThanOrEqual(1);

      const found = res.body.result.find(
        (l: any) => Number(l.id) === createdLogisticId,
      );
      expect(found).toBeDefined();
      expect(found.title).toBe(testTitle);
      expect(found).toHaveProperty('logisticUser');
      expect(found.logisticUser).not.toBeNull();
    });

    it('should respect limit and offset pagination', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/logistics?limit=10&offset=0')
        .set(authHeader())
        .expect(200);

      expect(res.body.result.length).toBeLessThanOrEqual(10);
    });

    it('should search by title', async () => {
      const searchTerm = testTitle.slice(0, 10);
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/admin/logistics?limit=10&search=${searchTerm}`)
        .set(authHeader())
        .expect(200);

      expect(res.body.total).toBeGreaterThanOrEqual(1);
      for (const l of res.body.result) {
        expect(l.title).toContain(searchTerm);
      }
    });
  });

  describe('GET /v1/api/ecommerce/admin/logistics/:id', () => {
    it('should return single logistic with full details', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/api/ecommerce/admin/logistics/${createdLogisticId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(Number(res.body.result.id)).toBe(createdLogisticId);
      expect(res.body.result.title).toBe(testTitle);
      expect(res.body.result).toHaveProperty('logisticUser');
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/logistics/999999999')
        .set(authHeader())
        .expect(404);
    });
  });

  describe('PUT /v1/api/ecommerce/admin/logistics/:id', () => {
    it('should return 400 for empty body', async () => {
      await request(app.getHttpServer())
        .put(`/v1/api/ecommerce/admin/logistics/${createdLogisticId}`)
        .set(authHeader())
        .send({})
        .expect(400);
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .put('/v1/api/ecommerce/admin/logistics/999999999')
        .set(authHeader())
        .send({
          title: 'Non-existent',
          user: {
            firstname: 'Test',
            lastname: 'User',
            phoneNumber: '95' + Date.now().toString().slice(-8),
          },
        })
        .expect(404);
    });

    it('should update an existing logistic', async () => {
      const res = await request(app.getHttpServer())
        .put(`/v1/api/ecommerce/admin/logistics/${createdLogisticId}`)
        .set(authHeader())
        .send({
          title: updatedTitle,
          user: {
            firstname: 'E2E',
            lastname: 'Updated',
            phoneNumber: phoneNumber,
          },
        })
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(res.body.result.title).toBe(updatedTitle);

      // verify persisted
      const logistic = await logisticModel.findOne({
        where: { id: createdLogisticId },
      });
      expect(logistic.title).toBe(updatedTitle);
    });
  });

  describe('DELETE /v1/api/ecommerce/admin/logistics/:id', () => {
    let deleteLogisticId: number;

    beforeAll(async () => {
      const delPhone = '96' + Date.now().toString().slice(-8);
      const res = await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/logistics')
        .set(authHeader())
        .send({
          title: 'To Delete Logistic ' + Date.now(),
          user: {
            firstname: 'Delete',
            lastname: 'Test',
            phoneNumber: delPhone,
          },
        })
        .expect(201);
      deleteLogisticId = Number(res.body.result.id);
    });

    it('should soft-delete an existing logistic', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/v1/api/ecommerce/admin/logistics/${deleteLogisticId}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('result');
      expect(Number(res.body.result.id)).toBe(deleteLogisticId);
      expect(res.body.result).toHaveProperty('title');

      const deleted = await logisticModel.findOne({
        where: { id: deleteLogisticId },
      });
      expect(deleted.isDeleted).toBeTruthy();
    });

    it('should return 404 for non-existent id', async () => {
      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/admin/logistics/999999999')
        .set(authHeader())
        .expect(404);
    });

    afterAll(async () => {
      const logisticUser = await logisticUserModel.findOne({
        where: { logisticId: deleteLogisticId },
      });
      if (logisticUser) {
        await userRoleModel.destroy({
          where: { userId: logisticUser.userId },
          force: true,
        });
        await logisticUserModel.destroy({
          where: { id: logisticUser.id },
          force: true,
        });
        await userModel.destroy({
          where: { id: logisticUser.userId },
          force: true,
        });
      }
      await logisticModel.destroy({
        where: { id: deleteLogisticId },
        force: true,
      });
    });
  });

  describe('security', () => {
    it('should fail with 403 if no auth token provided', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/logistics')
        .expect(403);

      await request(app.getHttpServer())
        .post('/v1/api/ecommerce/admin/logistics')
        .send({})
        .expect(403);

      await request(app.getHttpServer())
        .put('/v1/api/ecommerce/admin/logistics/1')
        .send({})
        .expect(403);

      await request(app.getHttpServer())
        .delete('/v1/api/ecommerce/admin/logistics/1')
        .expect(403);
    });
  });
});
