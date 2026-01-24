import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { authHeader, createE2EApp } from '@rahino/commontools/test/util';
import { ProductModule } from './product.module';

const hasDbConfig = Boolean(
  process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_PASS &&
    (process.env.DB_NAME_TEST || process.env.DB_NAME_DEVELOPMENT),
);

(hasDbConfig ? describe : describe.skip)('Products (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await createE2EApp({
      imports: [ProductModule],
    });
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /v1/api/ecommerce/products should return list wrapper ', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/api/ecommerce/products')
      .set(authHeader())
      .expect(200);

    // Interceptor-wrapped response
    expect(res.body).toHaveProperty('statusCode', 200);
    expect(res.body).toHaveProperty('result');
    expect(Array.isArray(res.body.result)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  it('GET /v1/api/ecommerce/products/id/:id should 404 for non-existent id', async () => {
    await request(app.getHttpServer())
      .get('/v1/api/ecommerce/products/id/0')
      .set(authHeader())
      .expect(404);
  });
});
