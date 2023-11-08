import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
const mkdirAsync = util.promisify(fs.mkdir);
const writeFileAsync = util.promisify(fs.writeFile);
const removeFileAsync = util.promisify(fs.rm);

@Injectable()
export class FileService {
  constructor(private config: ConfigService) {}

  generateProfilePathByCwd(userId: bigint) {
    const savePath = this.config
      .get<string>('PROFILE_PATH_ATTACHMENT')
      .concat(`/${userId}`);
    return path.join(process.cwd(), savePath);
  }
  generateProfileThumbPathByCwd(userId: bigint) {
    const savePath = this.config
      .get<string>('PROFILE_PATH_THUMB_ATTACHMENT')
      .concat(`/${userId}`);
    return path.join(process.cwd(), savePath);
  }
  async removeFilePathByCwd(filePath: string) {
    await removeFileAsync(path.join(process.cwd(), filePath));
  }
  async saveFileByPath(filePath: string, fileName: string, file: Buffer) {
    await mkdirAsync(filePath, { recursive: true });
    const attachmentSavePath = path.join(filePath, fileName);
    await writeFileAsync(attachmentSavePath, file);
  }
}
