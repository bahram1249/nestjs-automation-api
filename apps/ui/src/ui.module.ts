import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { WinstonLog } from '@rahino/database/models/core/winstonlog.entity';
import { DBLogger } from '@rahino/logger';
import { join } from 'path';
import * as hbs from 'express-handlebars';

@Module({
  imports: [SequelizeModule.forFeature([WinstonLog])],
  providers: [DBLogger],
})
export class UIModule implements NestModule {
  constructor(private readonly logger: DBLogger) {}
  configure(consumer: MiddlewareConsumer) {}
  setApp(app: NestExpressApplication) {
    this.logger.debug(join(__dirname, '../../../apps/ui', 'public'));
    app.useStaticAssets(join(__dirname, '../../../apps/ui', 'public'));
    app.setBaseViewsDir([
      join(__dirname, '../../../apps/ui', 'views/core'),
      join(__dirname, '../../../apps/ui', 'views/discountCoffe'),
    ]);
    app.engine(
      'hbs',
      hbs({
        extname: 'hbs',
        partialsDir: [
          join(__dirname, '../../../apps/ui', 'views/core/partials'),
          join(__dirname, '../../../apps/ui', 'views/discountCoffe/partials'),
        ],
        layoutsDir: join(__dirname, '../../../apps/ui', 'views/core/layouts'),
      }),
    );

    app.setViewEngine('hbs');
  }
}
