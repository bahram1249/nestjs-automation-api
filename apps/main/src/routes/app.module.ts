import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@rahino/database';
import helmet from 'helmet';
import { ThrottlerModule } from '@nestjs/throttler';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { CacheModule } from '@nestjs/cache-manager';
import { PCMModule } from '@rahino/pcm';
import { CoreModule } from '@rahino/core';
import { HttpExceptionFilter } from '@rahino/http-exception-filter';
import { DBLogger, DBLoggerModule } from '@rahino/logger';
import { EAVModule } from '@rahino/eav';
import { ECommerceModule } from '@rahino/ecommerce';
import { AutomapperModule } from 'automapper-nestjs';
import { classes } from 'automapper-classes';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UIModule } from '@rahino/ui';
import { CoreDashboardModule } from '@rahino/coreDashboard';
import * as cookieParser from 'cookie-parser';
import { DiscountCoffeModule } from '@rahino/discountCoffe';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5000,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 20,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 40,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 300,
      },
    ]),
    DatabaseModule,
    DBLoggerModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    CoreModule,
    UIModule,
    CoreDashboardModule,
    PCMModule,
    EAVModule,
    ECommerceModule,
    DiscountCoffeModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(
    private readonly logger: DBLogger,
    private readonly config: ConfigService,
  ) {}
  app: NestExpressApplication;
  async configure(consumer: MiddlewareConsumer) {
    //...
  }
  public async setApp(app: NestExpressApplication) {
    this.app = app;

    app.useLogger(this.logger);
    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.useGlobalFilters(new HttpExceptionFilter(this.logger));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
    app.enableCors({});
    app.use(cookieParser());

    app.get(CoreModule).setApp(app);
    app.get(PCMModule).setApp(app);
    app.get(EAVModule).setApp(app);
    app.get(UIModule).setApp(app);

    const port = this.config.get('HOST_PORT');
    const host = this.config.get('HOST_NAME');
    await app.listen(port, host, () => {
      this.logger.warn(`listening on http://${host}:${port}`);
    });
  }
}
