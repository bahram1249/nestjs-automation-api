import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@rahino/database';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import helmet from 'helmet';
import { ThrottlerModule } from '@nestjs/throttler';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { CacheModule } from '@nestjs/cache-manager';
import { PCMModule } from '@rahino/pcm';
import { CoreModule } from '@rahino/core';
import { HttpExceptionFilter } from '@rahino/http-exception-filter';
import { DBLogger, DBLoggerModule } from '@rahino/logger';

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
    // AutomapperModule.forRoot({
    //   strategyInitializer: classes(),
    // }),
    CoreModule,
    PCMModule,
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
  app: INestApplication;
  async configure(consumer: MiddlewareConsumer) {
    //...
  }
  public async setApp(app: INestApplication) {
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
    app.use(helmet());
    app.enableCors();

    app.get(CoreModule).setApp(app);
    app.get(PCMModule).setApp(app);

    const port = this.config.get('HOST_PORT');
    const host = this.config.get('HOST_NAME');
    await app.listen(port, host, () => {
      this.logger.warn(`listening on http://${host}:${port}`);
    });
  }
}
