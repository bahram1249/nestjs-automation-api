import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ScriptRunnerService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async runFromPath(pathStr: string) {
    const filePath = path.join(process.cwd(), pathStr);
    console.log(filePath);

    const content = fs.readFileSync(filePath, 'utf-8').toString();

    const queries = content.split(/GO(\s\s+|\n)/g);
    const platform = process.platform;
    const replacePattern = platform == 'win32' ? /^--.*$/g : /^--.*$/gm;

    for (const query of queries) {
      const queryWithoutComment = query.replaceAll(replacePattern, '');

      //const replaceQuery = queryWithoutComment.replaceAll(/\s\s+/g, ' ');
      await this.sequelize.query(queryWithoutComment, {
        raw: true,
        type: QueryTypes.RAW,
      });
    }
  }
}
