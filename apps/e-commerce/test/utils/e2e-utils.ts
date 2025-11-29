import {
  INestApplication,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
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
import { JwtGuard } from '@rahino/auth';
import { coreModels } from '@rahino/database';
import {
  bpmnModels,
  discountCoffeEntities,
  eavEntities,
  ecommerceEntities,
  guaranteeModels,
  pcmEntities,
} from '@rahino/localdatabase/subsystem-models';

// Shared testing JwtGuard: accepts any Bearer token and injects a mock req.user
export class TestingJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth: string | undefined = req.headers['authorization'];
    const token = auth?.startsWith('Bearer ')
      ? auth.slice('Bearer '.length)
      : undefined;
    if (!token) return false;
    req.user = {
      id: 1,
      username: 'e2e-test-user',
      token,
    };
    return true;
  }
}

// Build an e-commerce e2e Nest app with real DB connection
export async function createEcommerceE2EApp(options?: {
  imports?: any[];
  controllers?: any[];
  providers?: any[];
  overrideJwt?: boolean; // default: true
}): Promise<INestApplication> {
  const builder: TestingModuleBuilder = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: ['.env.test', '.env.development', '.env.local', '.env'],
        isGlobal: true,
      }),
      DatabaseModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          name: 'sequelize_default',
          dialect: configService.get<string>('DB_DIALECT') as any as any,
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
      I18nModule.forRoot({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: [
            // from apps/e-commerce/test/utils -> up to apps -> into main/src/i18n
            path.join(__dirname, '../../../main/src/i18n/'),
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
      ...(options?.imports ?? []),
    ],
    controllers: options?.controllers ?? [],
    providers: options?.providers ?? [],
  });

  if (options?.overrideJwt !== false) {
    builder.overrideGuard(JwtGuard).useClass(TestingJwtGuard);
  }

  const moduleRef = await builder.compile();
  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.init();
  return app;
}
