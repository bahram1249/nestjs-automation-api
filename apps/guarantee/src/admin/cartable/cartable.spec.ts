import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { GSCartableModule } from './cartable.module';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)('Cartable (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await createE2EApp({
      imports: [GSCartableModule],
    });
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /v1/api/guarantee/admin/cartables should return list wrapper (requires token)', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/api/guarantee/admin/cartables')
      .set(authHeader())
      .expect(200);

    // Interceptor-wrapped response
    expect(res.body).toHaveProperty('statusCode', 200);
    expect(res.body).toHaveProperty('result');
    expect(Array.isArray(res.body.result)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  it('should fail with 403 if token missing', async () => {
    await request(app.getHttpServer())
      .get('/v1/api/guarantee/admin/cartables')
      // intentionally no Authorization header
      .expect(403);
  });
});
