import { savingsGoalRepository } from '@repositories/savingsGoalRepository';
import { accountRepository } from '@repositories/accountRepository';
import { AppError } from '@middleware/errorHandler';
import type {
  SavingsGoal,
  CreateSavingsGoalData,
  UpdateSavingsGoalData,
  SavingsGoalProgress,
} from '@typings/core.types';

class SavingsGoalService {
  async listGoals(userId: string): Promise<SavingsGoal[]> {
    return savingsGoalRepository.findAllByUser(userId);
  }

  async getGoal(userId: string, goalId: string): Promise<SavingsGoal> {
    const goal = await savingsGoalRepository.findById(userId, goalId);
    if (!goal) throw new AppError('Savings goal not found', 404);
    return goal;
  }

  async createGoal(
    userId: string,
    input: Omit<CreateSavingsGoalData, 'userId'>
  ): Promise<SavingsGoal> {
    const account = await accountRepository.findById(input.accountId, userId);
    if (!account) throw new AppError('Account not found', 404);
    return savingsGoalRepository.create({ ...input, userId });
  }

  async updateGoal(
    userId: string,
    goalId: string,
    input: UpdateSavingsGoalData
  ): Promise<SavingsGoal> {
    const existing = await savingsGoalRepository.findById(userId, goalId);
    if (!existing) throw new AppError('Savings goal not found', 404);
    const updated = await savingsGoalRepository.update(userId, goalId, input);
    return updated!;
  }

  async deleteGoal(userId: string, goalId: string): Promise<void> {
    const existing = await savingsGoalRepository.findById(userId, goalId);
    if (!existing) throw new AppError('Savings goal not found', 404);
    await savingsGoalRepository.delete(userId, goalId);
  }

  async getProgress(userId: string, goalId: string): Promise<SavingsGoalProgress> {
    const goal = await savingsGoalRepository.findById(userId, goalId);
    if (!goal) throw new AppError('Savings goal not found', 404);

    const account = await accountRepository.findById(goal.accountId, userId);
    if (!account) throw new AppError('Associated account not found', 404);

    const currentAmount = Math.max(account.currentBalance, 0);
    const percentComplete =
      goal.targetAmount > 0
        ? Math.min(Math.round((currentAmount / goal.targetAmount) * 10000) / 100, 100)
        : 0;

    let daysToGoal: number | null = null;
    let projectedDate: string | null = null;

    if (goal.targetDate) {
      const today = new Date();
      const target = new Date(goal.targetDate + 'T00:00:00Z');
      daysToGoal = Math.max(
        Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        0
      );
    }

    if (daysToGoal !== null && daysToGoal > 0 && currentAmount < goal.targetAmount) {
      const remaining = goal.targetAmount - currentAmount;
      const dailyRate = remaining / daysToGoal;
      if (dailyRate > 0) {
        const daysNeeded = Math.ceil(remaining / dailyRate);
        const projected = new Date();
        projected.setDate(projected.getDate() + daysNeeded);
        projectedDate = projected.toISOString().slice(0, 10);
      }
    }

    return {
      goalId: goal.id,
      name: goal.name,
      currentAmount,
      targetAmount: goal.targetAmount,
      percentComplete,
      daysToGoal,
      projectedDate,
    };
  }
}

export const savingsGoalService = new SavingsGoalService();
