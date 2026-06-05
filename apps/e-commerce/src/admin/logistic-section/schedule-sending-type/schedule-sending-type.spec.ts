import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { ScheduleSendingTypeModule } from './schedule-sending-type.module';
import { ECScheduleSendingType } from '@rahino/localdatabase/models';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)('Admin-ScheduleSendingType (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await createE2EApp({
      imports: [ScheduleSendingTypeModule],
    });
  });

  afterAll(async () => {
    if (!app) return;
    await app.close();
  });

  describe('GET /v1/api/ecommerce/admin/scheduleSendingTypes', () => {
    it('should return paginated list of schedule sending types', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/scheduleSendingTypes?limit=100')
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty('statusCode', 200);
      expect(res.body).toHaveProperty('result');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.total).toBeGreaterThanOrEqual(2);

      const first = res.body.result[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('title');
    });

    it('should include seeded normalSending (id=1) and expressSending (id=2)', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/scheduleSendingTypes?limit=100')
        .set(authHeader())
        .expect(200);

      const normal = res.body.result.find(
        (s: any) => Number(s.id) === 1,
      );
      expect(normal).toBeDefined();
      expect(normal.title).toBeDefined();

      const express = res.body.result.find(
        (s: any) => Number(s.id) === 2,
      );
      expect(express).toBeDefined();
      expect(express.title).toBeDefined();
    });
  });

  describe('security', () => {
    it('should fail with 403 if no auth token provided', async () => {
      await request(app.getHttpServer())
        .get('/v1/api/ecommerce/admin/scheduleSendingTypes')
        .expect(403);
    });
  });
});
