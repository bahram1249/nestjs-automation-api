import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
const mkdirAsync = util.promisify(fs.mkdir);
const writeFileAsync = util.promisify(fs.writeFile);
const rmAsync = util.promisify(fs.rm);

@Injectable()
export class FileService {
  constructor(private config: ConfigService) {}

  generateProfilePathByCwd(userId: bigint): {
    savePath: string;
    cwdPath: string;
  } {
    const savePath = this.config
      .get<string>('PROFILE_PATH_ATTACHMENT')
      .concat(`/${userId}`);
    return {
      savePath: savePath,
      cwdPath: path.join(process.cwd(), savePath),
    };
  }
  generateProfileThumbPathByCwd(userId: bigint): {
    savePath: string;
    cwdPath: string;
  } {
    const savePath = this.config
      .get<string>('PROFILE_PATH_THUMB_ATTACHMENT')
      .concat(`/${userId}`);
    return {
      savePath: savePath,
      cwdPath: path.join(process.cwd(), savePath),
    };
  }
  async removeFilePathByCwd(filePath: string) {
    await rmAsync(path.join(process.cwd(), filePath));
  }
  async removeFileAsync(filePath: string) {
    await rmAsync(filePath);
  }
  async saveFileByPathAsync(
    filePath: string,
    fileName: string,
    file: Buffer,
  ): Promise<string> {
    await mkdirAsync(filePath, { recursive: true });
    const attachmentSavePath = path.join(filePath, fileName);
    await writeFileAsync(attachmentSavePath, file);
    return attachmentSavePath;
  }
}
