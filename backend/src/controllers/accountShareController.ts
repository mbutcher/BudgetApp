import type { Request, Response } from 'express';
import { asyncHandler, AppError } from '@middleware/errorHandler';
import { accountRepository } from '@repositories/accountRepository';
import { accountShareRepository } from '@repositories/accountShareRepository';
import { householdMemberRepository } from '@repositories/householdMemberRepository';
import type { AccountShareAccessLevel, UpsertAccountShareData } from '@typings/core.types';

class AccountShareController {
  /** GET /accounts/:id/shares — owner only */
  getShares = asyncHandler(async (req: Request, res: Response) => {
    const account = await accountRepository.findById(req.params['id']!, req.user!.id);
    if (!account) throw new AppError('Account not found', 404);
    if (account.userId !== req.user!.id) throw new AppError('Owner access required', 403);

    const shares = await accountShareRepository.findByAccountId(account.id);
    res.json({ status: 'success', data: { shares } });
  });

  /** PUT /accounts/:id/shares — replace all shares; owner only */
  putShares = asyncHandler(async (req: Request, res: Response) => {
    const account = await accountRepository.findById(req.params['id']!, req.user!.id);
    if (!account) throw new AppError('Account not found', 404);
    if (account.userId !== req.user!.id) throw new AppError('Owner access required', 403);

    const { shares } = req.body as { shares: UpsertAccountShareData[] };

    // Verify all shared users are members of the owner's household
    const householdId = req.user!.householdId;
    if (householdId && shares.length > 0) {
      const members = await householdMemberRepository.findAllByHouseholdId(householdId);
      const memberIds = new Set(members.map((m) => m.userId));
      for (const share of shares) {
        if (!memberIds.has(share.userId)) {
          throw new AppError(`User ${share.userId} is not a member of this household`, 400);
        }
        if (share.userId === req.user!.id) {
          throw new AppError('Cannot share an account with its owner', 400);
        }
      }
    }

    await accountShareRepository.upsertShares(account.id, shares);
    const updated = await accountShareRepository.findByAccountId(account.id);
    res.json({ status: 'success', data: { shares: updated } });
  });

  /** PATCH /accounts/:id/shares/:userId — update a single share's access level; owner only */
  patchShare = asyncHandler(async (req: Request, res: Response) => {
    const account = await accountRepository.findById(req.params['id']!, req.user!.id);
    if (!account) throw new AppError('Account not found', 404);
    if (account.userId !== req.user!.id) throw new AppError('Owner access required', 403);

    const targetUserId = req.params['userId']!;
    const { accessLevel } = req.body as { accessLevel: AccountShareAccessLevel };

    await accountShareRepository.updateAccessLevel(account.id, targetUserId, accessLevel);
    res.json({ status: 'success', data: null });
  });
}

export const accountShareController = new AccountShareController();
