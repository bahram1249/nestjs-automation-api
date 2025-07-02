import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { v4 as uuidv4 } from 'uuid';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

export function imageOptions(): MulterOptions {
  return {
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        fs.mkdirSync(path.join(process.cwd(), '/tmp/attachmentFile'), {
          recursive: true,
        });
        cb(null, path.join(process.cwd(), '/tmp/attachmentFile'));
      },
      filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname)); //Appending extension
      },
    }),
  };
}
