import {
  MiddlewareConsumer,
  Module,
  NestModule,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@rahino/database';
import { coreModels } from '@rahino/database';
import helmet from 'helmet';
import { ThrottlerModule } from '@nestjs/throttler';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { CacheModule } from '@nestjs/cache-manager';
import { CoreModule } from '@rahino/core';
import { HttpExceptionFilter } from '@rahino/http-exception-filter';
import { DBLogger, DBLoggerModule } from '@rahino/logger';
import { AutomapperModule } from 'automapper-nestjs';
import { classes } from 'automapper-classes';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { DynamicProviderModule } from '../dynamic-provider/dynamic-provider.module';
import { ThrottlerBehindProxyGuard } from '@rahino/commontools/guard';
import { APP_GUARD, ModuleRef } from '@nestjs/core';
import {
  AcceptLanguageResolver,
  I18nModule,
  I18nValidationPipe,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { AppLanguageResolver } from '../i18nResolver/AppLanguageResolver';
import { KnexModule } from 'nestjs-knex';
import { useContainer } from 'class-validator';
const cluster = require('cluster');
import * as os from 'os';
import { Dialect } from 'sequelize';
import {
  bpmnModels,
  discountCoffeEntities,
  eavEntities,
  ecommerceEntities,
  guaranteeModels,
  pcmEntities,
} from '@rahino/localdatabase/subsystem-models';
import { ModuleInitializerModule } from '../module-initializer/module-initializer.module';
import { ModuleInitializerServiceInterface } from '../module-initializer/interface';

@Module({
  imports: [
    ModuleInitializerModule,
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
          ...bpmnModels,
          ...guaranteeModels,
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
    // UIModule,
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
    private readonly moduleRef: ModuleRef,
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
    // app.use(
    //   session({
    //     secret: this.config.get('SESSION_KEY'),
    //     resave: false,
    //     saveUninitialized: false,
    //   }),
    // );

    await this.initializerModule(app);
  }

  private async initializerModule(app: NestExpressApplication) {
    const numCpu = Number(
      this.config.get<string>('CLUSTER_COUNT') || os.cpus().length,
    );

    if (cluster.isPrimary) {
      for (let i = 0; i < numCpu; i++) {
        console.log(i);
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        this.logger.warn(`worker exit ${worker.process.pid} !`);
        cluster.fork();
      });
    } else {
      const projectName = this.config.get<string>('PROJECT_NAME');
      const serviceInstance: ModuleInitializerServiceInterface =
        await this.moduleRef.get<ModuleInitializerServiceInterface>(
          projectName + 'InitializerService',
          {
            strict: false,
          },
        );

      if (!serviceInstance) {
        throw new Error(
          `Service with token ${projectName + 'InitializerService'} not found`,
        );
      }

      await serviceInstance.init(app);

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
