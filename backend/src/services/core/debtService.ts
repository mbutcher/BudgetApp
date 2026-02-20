import { debtRepository } from '@repositories/debtRepository';
import { accountRepository } from '@repositories/accountRepository';
import { transactionRepository } from '@repositories/transactionRepository';
import { AppError } from '@middleware/errorHandler';
import logger from '@utils/logger';
import type {
  DebtSchedule,
  TransactionSplit,
  UpsertDebtScheduleData,
  AmortizationRow,
  AmortizationSchedule,
  WhatIfResult,
} from '@typings/core.types';

const round2 = (n: number): number => Math.round(n * 100) / 100;

function buildAmortizationRows(
  principal: number,
  annualRate: number,
  termMonths: number,
  paymentAmount: number
): AmortizationRow[] {
  const monthlyRate = annualRate / 12;
  let balance = principal;
  const rows: AmortizationRow[] = [];

  for (let month = 1; month <= termMonths && balance > 0.005; month++) {
    const interest = round2(balance * monthlyRate);
    const principalPaid = round2(Math.min(paymentAmount - interest, balance));
    balance = round2(balance - principalPaid);
    rows.push({
      month,
      payment: round2(principalPaid + interest),
      principal: principalPaid,
      interest,
      balance,
    });
  }

  return rows;
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

class DebtService {
  async getSchedule(userId: string, accountId: string): Promise<DebtSchedule | null> {
    return debtRepository.findByUserAndAccount(userId, accountId);
  }

  async upsertSchedule(userId: string, data: UpsertDebtScheduleData): Promise<DebtSchedule> {
    const account = await accountRepository.findById(data.accountId, userId);
    if (!account) throw new AppError('Account not found', 404);
    return debtRepository.upsert(userId, data);
  }

  async deleteSchedule(userId: string, accountId: string): Promise<void> {
    const existing = await debtRepository.findByUserAndAccount(userId, accountId);
    if (!existing) throw new AppError('Debt schedule not found', 404);
    await debtRepository.delete(userId, accountId);
  }

  async getAmortizationSchedule(userId: string, accountId: string): Promise<AmortizationSchedule> {
    const schedule = await debtRepository.findByUserAndAccount(userId, accountId);
    if (!schedule) throw new AppError('Debt schedule not found', 404);

    const rows = buildAmortizationRows(
      schedule.principal,
      schedule.annualRate,
      schedule.termMonths,
      schedule.paymentAmount
    );

    const totalInterest = round2(rows.reduce((sum, r) => sum + r.interest, 0));
    const payoffDate = addMonths(schedule.originationDate, rows.length);

    return { schedule: rows, totalInterest, payoffDate };
  }

  async whatIfExtraPayment(
    userId: string,
    accountId: string,
    extraMonthly: number
  ): Promise<WhatIfResult> {
    const schedule = await debtRepository.findByUserAndAccount(userId, accountId);
    if (!schedule) throw new AppError('Debt schedule not found', 404);

    const originalRows = buildAmortizationRows(
      schedule.principal,
      schedule.annualRate,
      schedule.termMonths,
      schedule.paymentAmount
    );

    const newRows = buildAmortizationRows(
      schedule.principal,
      schedule.annualRate,
      schedule.termMonths,
      schedule.paymentAmount + extraMonthly
    );

    const originalPayoffDate = addMonths(schedule.originationDate, originalRows.length);
    const newPayoffDate = addMonths(schedule.originationDate, newRows.length);
    const monthsSaved = originalRows.length - newRows.length;
    const originalInterest = round2(originalRows.reduce((sum, r) => sum + r.interest, 0));
    const newInterest = round2(newRows.reduce((sum, r) => sum + r.interest, 0));
    const interestSaved = round2(originalInterest - newInterest);

    return { originalPayoffDate, newPayoffDate, monthsSaved, interestSaved };
  }

  /**
   * Called after a payment transaction is committed against a loan/mortgage/credit_card account.
   * Computes principal/interest split and records it. Errors are logged but non-fatal.
   */
  async autoSplitPayment(
    transactionId: string,
    accountId: string,
    userId: string,
    transactionAmount: number
  ): Promise<TransactionSplit | null> {
    try {
      const schedule = await debtRepository.findByUserAndAccount(userId, accountId);
      if (!schedule) return null;

      const account = await accountRepository.findById(accountId, userId);
      if (!account) return null;

      // Use current balance as remaining debt for interest calculation
      const runningBalance = Math.abs(account.currentBalance);
      const monthlyRate = schedule.annualRate / 12;
      const interest = round2(runningBalance * monthlyRate);
      const payment = Math.abs(transactionAmount);
      const principalPaid = round2(Math.max(payment - interest, 0));
      const interestPaid = round2(Math.min(interest, payment));

      return await debtRepository.createSplit({
        transactionId,
        principalAmount: principalPaid,
        interestAmount: interestPaid,
      });
    } catch (err) {
      logger.error('autoSplitPayment failed (non-fatal)', { transactionId, accountId, err });
      return null;
    }
  }

  async getSplitForTransaction(
    userId: string,
    transactionId: string
  ): Promise<TransactionSplit | null> {
    // Verify the transaction belongs to the user
    const tx = await transactionRepository.findById(transactionId, userId);
    if (!tx) throw new AppError('Transaction not found', 404);
    return debtRepository.findSplitByTransaction(transactionId);
  }
}

export const debtService = new DebtService();
