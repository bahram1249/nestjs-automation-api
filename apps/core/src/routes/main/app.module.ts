import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../database/sequelize/database.module';
import { CoreRouteModule } from '../core/core-route.module';
import { InjectModel, SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '../../database/sequelize/models/core/permission.entity';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    DatabaseModule,
    SequelizeModule.forFeature([Permission]),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    CoreRouteModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    @InjectModel(Permission)
    private readonly permissionReopsiory: typeof Permission,
  ) {}
  app: INestApplication;
  async configure(consumer: MiddlewareConsumer) {
    //...
  }
  public async setApp(app: INestApplication) {
    this.app = app;
    const server = app.getHttpServer();

    const router = server._events.request._router;

    const existingRoutes: [] = router.stack
      .map((routeObj) => {
        if (routeObj.route) {
          return {
            route: {
              path: routeObj.route?.path,
              method: routeObj.route?.stack[0].method,
            },
          };
        }
      })
      .filter((item) => item !== undefined);
    for (var index = 0; index < existingRoutes.length; index++) {
      var item = existingRoutes[index];
      let permission = await this.permissionReopsiory.findOne({
        where: {
          permissionUrl: item['route']['path'],
          permissionMethod: item['route']['method'],
        },
      });
      if (!permission) {
        permission = await this.permissionReopsiory.create({
          permissionUrl: item['route']['path'],
          permissionMethod: item['route']['method'],
        });
      }
    }
  }
}
