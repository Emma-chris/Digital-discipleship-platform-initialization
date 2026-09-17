import type { AuthPrincipal } from '@church/shared';

declare global {
  namespace Express {
    interface Request {
      /** Populated by requireAuth. Never trust client-supplied values here. */
      principal?: AuthPrincipal;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export {};