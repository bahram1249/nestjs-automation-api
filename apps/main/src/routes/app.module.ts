import {
  MiddlewareConsumer,
  Module,
  NestModule,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@rahino/database';
import {
  coreModels,
  discountCoffeEntities,
  eavEntities,
  ecommerceEntities,
  pcmEntities,
} from '@rahino/database/dist/subsystem-models';
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
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { DynamicProviderModule } from '../dynamic-provider/dynamic-provider.module';
import { ThrottlerBehindProxyGuard } from '@rahino/commontools/guard';
import { APP_GUARD } from '@nestjs/core';
import {
  AcceptLanguageResolver,
  I18nModule,
  I18nService,
  I18nValidationPipe,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { AppLanguageResolver } from '../i18nResolver/AppLanguageResolver';
import { ECommerceSmsModule } from '@rahino/ecommerce/util/sms/ecommerce-sms.module';
import { ECommmerceSmsService } from '@rahino/ecommerce/util/sms/ecommerce-sms.service';
import { KnexModule } from 'nestjs-knex';
import { useContainer } from 'class-validator';
const cluster = require('cluster');
import * as os from 'os';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.local', '.env'],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'short',
          ttl: 1000,
          limit: config.get('THROTTLER_SHORT_LIMIT'),
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: config.get('THROTTLER_MEDIUM_LIMIT'),
        },
        {
          name: 'long',
          ttl: 60000,
          limit: config.get('THROTTLER_LONG_LIMIT'),
        },
      ],
    }),
    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'sequelize_default',
        dialect: configService.get<Dialect>('DB_DIALECT'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME_DEVELOPMENT'),
        autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS') === 'true',
        logging: configService.get('DB_LOG') === 'true',
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
        timezone: configService.get('DB_TIMEZONE') || 'fa-IR',
        models: [
          ...coreModels,
          ...eavEntities,
          ...ecommerceEntities,
          ...pcmEntities,
          ...discountCoffeEntities,
        ],
      }),
    }),
    KnexModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        config: {
          client: 'mssql',
          useNullAsDefault: true,
          connection: {
            host: config.get<string>('DB_HOST'),
            port: Number(config.get<number>('DB_PORT')),
            user: config.get<string>('DB_USER'),
            password: config.get<string>('DB_PASS'),
            database: config.get<string>('DB_NAME_DEVELOPMENT'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    DBLoggerModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    CoreModule,
    UIModule,
    DynamicProviderModule.register(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: [path.join(__dirname, '../../../../../apps/main/src/i18n/')],
        watch: true,
      },
      resolvers: [
        AppLanguageResolver,
        {
          use: QueryResolver,
          options: ['lang'],
        },
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(
        __dirname,
        '../../../../../apps/main/src/generated/i18n.generated.ts',
      ),
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ECommerceSmsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(
    private readonly logger: DBLogger,
    private readonly config: ConfigService,
    private readonly i18n: I18nService,
    private readonly smsService: ECommmerceSmsService,
  ) {}
  app: NestExpressApplication;
  async configure(consumer: MiddlewareConsumer) {}
  public async setApp(app: NestExpressApplication) {
    this.app = app;

    app.set('trust proxy', true);

    app.useLogger(this.logger);
    app.enableVersioning({
      type: VersioningType.URI,
    });

    app.useGlobalPipes(
      // new ValidationPipe({
      //   whitelist: true,
      //   transform: true,
      // }),
      new I18nValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalFilters(
      //new I18nValidationExceptionFilter(),
      //new
      //new CustomI18nValidationExceptionFilter(),
      new HttpExceptionFilter(this.logger),
    );

    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
    app.enableCors({});
    app.use(cookieParser());
    app.use(
      session({
        secret: this.config.get('SESSION_KEY'),
        resave: false,
        saveUninitialized: false,
      }),
    );

    app.get(CoreModule).setApp(app);
    app.get(UIModule).setApp(app);
    const projectName = this.config.get<string>('PROJECT_NAME');
    if (projectName == 'ECommerce') {
      app.get(EAVModule).setApp(app);
      app.get(ECommerceModule).setApp(app);
    } else if (projectName == 'DiscountCoffe') {
    } else if (projectName == 'PCM') {
      app.get(PCMModule).setApp(app);
    }

    const numCpu = Number(
      this.config.get<string>('CLUSTER_COUNT') || os.cpus().length,
    );

    if (cluster.isPrimary) {
      for (let i = 0; i < numCpu; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        this.logger.warn(`worker exit ${worker.process.pid} !`);
        cluster.fork();
      });
    } else {
      const port = this.config.get('HOST_PORT');
      const host = this.config.get('HOST_NAME');

      await app.listen(port, host, () => {
        this.logger.warn(
          `listening on http://${host}:${port} with pid ${process.pid}`,
        );
      });
    }
  }
}
