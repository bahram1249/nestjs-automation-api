import { ECUserSession } from '@rahino/localdatabase/models';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      ecsession?: ECUserSession; // Define your custom property here
      // You can add other custom properties or methods here as needed
    }
  }
}
