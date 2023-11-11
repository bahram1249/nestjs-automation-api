import {
  INestApplication,
  Inject,
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
import { CoreModule } from '@rahino/core/core.module';
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
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../../../../', 'client/dist'),
    }),
    ClientsModule.register([
      {
        name: 'NOTIFY_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: '127.0.0.1',
          port: 6379,
        },
      },
    ]),
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
    @Inject(DBLogger)
    private readonly logger: DBLogger,
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {}
  app: INestApplication;
  async configure(consumer: MiddlewareConsumer) {
    //...
  }
  public async setApp(app: INestApplication) {
    this.app = app;

    app.useLogger(this.logger);

    // app.connectMicroservice<MicroserviceOptions>({
    //   transport: Transport.REDIS,
    //   options: {
    //     host: '127.0.0.1',
    //     port: 6379,
    //   },
    // });
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

    await app.listen(this.config.get('HOST_PORT'));
  }
}
