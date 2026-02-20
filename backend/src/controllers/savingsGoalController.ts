import type { Request, Response } from 'express';
import { asyncHandler } from '@middleware/errorHandler';
import { savingsGoalService } from '@services/core/savingsGoalService';
import type { CreateSavingsGoalData, UpdateSavingsGoalData } from '@typings/core.types';

class SavingsGoalController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const goals = await savingsGoalService.listGoals(req.user!.id);
    res.json({ status: 'success', data: { goals } });
  });

  get = asyncHandler(async (req: Request, res: Response) => {
    const goal = await savingsGoalService.getGoal(req.user!.id, req.params['id']!);
    res.json({ status: 'success', data: { goal } });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const input = req.body as Omit<CreateSavingsGoalData, 'userId'>;
    const goal = await savingsGoalService.createGoal(req.user!.id, input);
    res.status(201).json({ status: 'success', data: { goal } });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const input = req.body as UpdateSavingsGoalData;
    const goal = await savingsGoalService.updateGoal(req.user!.id, req.params['id']!, input);
    res.json({ status: 'success', data: { goal } });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await savingsGoalService.deleteGoal(req.user!.id, req.params['id']!);
    res.json({ status: 'success', data: null });
  });

  getProgress = asyncHandler(async (req: Request, res: Response) => {
    const progress = await savingsGoalService.getProgress(req.user!.id, req.params['id']!);
    res.json({ status: 'success', data: { progress } });
  });
}

export const savingsGoalController = new SavingsGoalController();
