import { VersioningType } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@rahino/database';
import {
  I18nModule,
  QueryResolver,
  AcceptLanguageResolver,
  I18nValidationPipe,
} from 'nestjs-i18n';
import * as path from 'path';
import { JwtGuard, OptionalJwtGuard } from '@rahino/auth';
import { coreModels } from '@rahino/database';
import {
  bpmnModels,
  discountCoffeEntities,
  eavEntities,
  ecommerceEntities,
  guaranteeModels,
  pcmEntities,
} from '@rahino/localdatabase/subsystem-models';
import { MockGetUserInterceptor, TestingJwtGuard } from '.';
import { Dialect } from 'sequelize';
import { AutomapperModule } from 'automapper-nestjs';
import { classes } from 'automapper-classes';
import { CacheModule } from '@nestjs/cache-manager';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';

// Shared testing JwtGuard: accepts any Bearer token and injects a mock req.user

export async function createE2EApp(options?: {
  imports?: any[];
  controllers?: any[];
  providers?: any[];
  overrideJwt?: boolean; // default: true
}): Promise<NestExpressApplication> {
  const builder: TestingModuleBuilder = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: ['.env.test'],
        isGlobal: true,
      }),
      DatabaseModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          // name: 'sequelize_default',
          dialect: configService.get<Dialect>('DB_DIALECT'),
          logQueryParameters: true,
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database:
            configService.get<string>('DB_NAME_TEST') ||
            configService.get<string>('DB_NAME_DEVELOPMENT'),
          autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS') === 'true',
          logging: (configService.get('DB_LOG') as any) === 'true',
          synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
          timezone:
            (configService.get<string>('DB_TIMEZONE') as string) || 'fa-IR',
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
      I18nModule.forRoot({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: [
            // from apps/e-commerce/test/utils -> up to apps -> into main/src/i18n
            path.join(__dirname, '../../../../../apps/main/src/i18n/'),
          ],
          watch: false,
        },
        resolvers: [
          {
            use: QueryResolver,
            options: ['lang'],
          },
          AcceptLanguageResolver,
        ],
      }),
      AutomapperModule.forRoot({
        strategyInitializer: classes(),
      }),
      CacheModule.register({
        isGlobal: true,
        ttl: 60000,
      }),
      ...(options?.imports ?? []),
    ],
    controllers: options?.controllers ?? [],
    providers: options?.providers ?? [],
  });

  if (options?.overrideJwt !== false) {
    builder.overrideGuard(JwtGuard).useClass(TestingJwtGuard);
    builder.overrideGuard(OptionalJwtGuard).useClass(TestingJwtGuard);
  }

  const moduleRef = await builder.compile();

  const app = moduleRef.createNestApplication<NestExpressApplication>();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.init();

  const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

  // Apply the mock interceptor globally
  app.useGlobalInterceptors(new MockGetUserInterceptor(mockUser));

  return app;
}
