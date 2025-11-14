import 'express';
import type { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface AuthPayload extends JwtPayload {
      sub: number; // match whatever you store in the token
    }

    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};