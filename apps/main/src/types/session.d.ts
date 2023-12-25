import * as session from 'express-session';

declare module 'express-session' {
  interface Session {
    userId?: bigint;
    verifyCode?: string;
  }
}
