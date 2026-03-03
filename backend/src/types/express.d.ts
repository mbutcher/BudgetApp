import type { HouseholdRole } from './core.types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; householdId?: string; householdRole?: HouseholdRole };
    /** Scopes present when authenticated via API key; undefined when authenticated via JWT */
    apiKeyScopes?: string[];
  }
}

export {};
