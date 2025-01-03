import {
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { WinstonLog } from '@rahino/database';
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
      join(__dirname, '../../../apps/ui', 'views/discount-coffe'),
    ]);
    app.engine(
      'hbs',
      hbs({
        extname: 'hbs',
        helpers: {
          section: function (name, options) {
            if (!this._sections) {
              this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
          },
          ifequals: function (arg1, arg2) {
            return arg1 == arg2;
          },
          ifnotequals: function (arg1, arg2) {
            return arg1 !== arg2;
          },
          ifCond: function (v1, v2, options) {
            if (v1 === v2) {
              return options.fn(this);
            }
            return options.inverse(this);
          },

          isnotnull: function (value) {
            return value !== null;
          },
          isnull: function (value) {
            return value == null;
          },
          isDefined: function (value) {
            return value != undefined && value != null;
          },
          haveitem: function (value) {
            return value.length > 0;
          },
          isBetweenValue: function (value, start, end) {
            return value >= start && value <= end;
          },
          isLessThanCurrentDate: function (value) {
            console.log(value);
            return new Date(value) < new Date();
          },
          isNot: function (value) {
            return value == false;
          },
          isTrue: function (value) {
            return value == true;
          },
          json: function (context) {
            return JSON.stringify(context);
          },
          modBy: function (value, dividBy) {
            if (value % dividBy == 0) return true;
            return false;
          },
          trStart: function (className) {
            return `<tr class="${className}">`;
          },
          trEnd: function () {
            return '</tr>';
          },

          initem: function (value, ...values) {
            const index = values.findIndex((item) => item == value);

            if (index != -1) return true;
            return false;
          },
          isexists: function (value, values: any[]) {
            const index = values.findIndex((item) => item == value);
            if (index != -1) return true;
            return false;
          },
          ifLengthGreater: function (obj, length) {
            if (obj.length > length) return true;
            return false;
          },
          replaceTextAreaBreakToEndLine(txt) {
            return txt;
          },
          limit(arr, limit) {
            if (!Array.isArray(arr)) {
              return [];
            }
            return arr.slice(0, limit);
          },
          limitCharacter(text, limit) {
            if (text == undefined || text == null) return text;
            if (text.length > limit) {
              return text.substring(0, limit) + ' ...';
            }
            return text;
          },
          plusone(number) {
            return number + 1;
          },
          displayPageTitle(page, language) {
            if (page[language] != null) {
              return page[language].title;
            }
            return page.title;
          },
          displayPageContent(page, language) {
            if (page[language] != null) {
              return page[language].content;
            }
            return page.content;
          },
          displayPagePreviewContent(page, language) {
            if (language == 'default') {
            }
            if (page[language] != null) {
              return page[language].previewContent;
            }
            return page.previewContent;
          },
          displayCategoryName(category, language) {
            if (category[language] != null) {
              return category[language].name;
            }
            return category.name;
          },
          convertToDate(date) {
            const months = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ];
            const d = new Date(date);
            const day = d.getDate().toString();
            const year = d.getFullYear().toString();
            const month = months[d.getMonth()].toString();

            return day.concat(' ', month, ' ', year);
          },
        },
        partialsDir: [
          join(__dirname, '../../../apps/ui', 'views/core/partials'),
          join(__dirname, '../../../apps/ui', 'views/discount-coffe/partials'),
        ],
        layoutsDir: join(__dirname, '../../../apps/ui', 'views/core/layouts'),
      }),
    );

    app.setViewEngine('hbs');
  }
}
