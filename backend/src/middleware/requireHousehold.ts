import type { Request, Response, NextFunction } from 'express';
import { asyncHandler, AppError } from '@middleware/errorHandler';
import { householdMemberRepository } from '@repositories/householdMemberRepository';

/**
 * Middleware that looks up the authenticated user's household membership and
 * attaches `householdId` + `householdRole` to `req.user`.
 *
 * Throws 403 if the user has no household yet (setup required).
 * Must be applied AFTER `authenticate` or `authenticateAny`.
 */
export const loadHousehold = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const member = await householdMemberRepository.findByUserId(req.user!.id);
    if (!member) {
      throw new AppError('Household setup required', 403);
    }
    req.user!.householdId = member.householdId;
    req.user!.householdRole = member.role;
    next();
  }
);

/**
 * Middleware that enforces owner role on household-scoped routes.
 * Must be applied AFTER `loadHousehold`.
 */
export const requireOwner = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.user?.householdRole !== 'owner') {
    return next(new AppError('Owner role required', 403));
  }
  next();
};
