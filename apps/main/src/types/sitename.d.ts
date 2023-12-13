// declare namespace Express {
//   export interface Request {
//     sitename?: string;
//   }
// }

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      sitename?: string; // Define your custom property here
      // You can add other custom properties or methods here as needed
    }
  }
}
