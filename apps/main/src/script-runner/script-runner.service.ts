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

    for (const query of queries) {
      var queryWithoutComment = query.replaceAll(/^--.*$/gm, '');
      await this.sequelize.query(
        queryWithoutComment.replaceAll(/\s\s+/g, ' '),
        {
          raw: true,
          type: QueryTypes.RAW,
        },
      );
    }
  }
}
