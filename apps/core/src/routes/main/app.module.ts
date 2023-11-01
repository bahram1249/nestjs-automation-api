import {
  INestApplication,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../../database/sequelize/database.module';
import { CoreRouteModule } from '../core/core-route.module';
import { InjectModel, SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '../../database/sequelize/models/core/permission.entity';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { PermissionCheckerModule } from '../../util/core/permission/permission-checker.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpExceptionFilter } from '../../util/core/filter';
import { DBLogger } from '../../util/core/logger/db-logger.service';
import { DBLoggerModule } from '../../util/core/logger/db-logger.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ThrottlerModule } from '@nestjs/throttler';
import { DevtoolsModule } from '@nestjs/devtools-integration';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../../', 'client/dist'),
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
    SequelizeModule.forFeature([Permission]),
    DBLoggerModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    CoreRouteModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
  providers: [AppService, PermissionCheckerModule],
})
export class AppModule implements NestModule {
  constructor(
    @InjectModel(Permission)
    private readonly permissionReopsiory: typeof Permission,
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

    const config = new DocumentBuilder()
      .setTitle('Nestjs Api')
      .setDescription('The Core API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth')
      .addTag('Admin-PermissionGroups')
      .addTag('Admin-Permissions')
      .addTag('Admin-Role')
      .addTag('Admin-Menu')
      .addTag('Admin-Users')
      .addTag('User-Roles')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api', app, document);
    await app.listen(this.config.get('HOST_PORT'));
    // const server = app.getHttpServer();

    // const router = server._events.request._router;

    // const stacks = this.app.getHttpAdapter().getInstance()._router.stack;
    // stacks.forEach((layer) => {
    //   if (layer.route) {
    //     console.log(layer.route);
    //   }
    // });

    // const existingRoutes: [] = router.stack
    //   .map((routeObj) => {
    //     if (routeObj.route) {
    //       return {
    //         route: {
    //           path: routeObj.route?.path,
    //           method: routeObj.route?.stack[0].method,
    //         },
    //       };
    //     }
    //   })
    //   .filter((item) => item !== undefined);
    // for (var index = 0; index < existingRoutes.length; index++) {
    //   var item = existingRoutes[index];
    //   let permission = await this.permissionReopsiory.findOne({
    //     where: {
    //       permissionUrl: item['route']['path'],
    //       permissionMethod: item['route']['method'],
    //     },
    //   });
    //   if (!permission) {
    //     permission = await this.permissionReopsiory.create({
    //       permissionUrl: item['route']['path'],
    //       permissionMethod: item['route']['method'],
    //     });
    //   }
    // }
  }
}
