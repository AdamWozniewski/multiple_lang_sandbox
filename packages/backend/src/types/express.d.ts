import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      [key: string]: any | undefined;
    } | null;
  }
}