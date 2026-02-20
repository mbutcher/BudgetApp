// ─── Accounts ────────────────────────────────────────────────────────────────

export type AccountType =
  | 'checking'
  | 'savings'
  | 'credit_card'
  | 'loan'
  | 'mortgage'
  | 'investment'
  | 'other';

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  isAsset: boolean;
  startingBalance: number;
  currentBalance: number;
  currency: string;
  color: string | null;
  institution: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountData {
  userId: string;
  name: string;
  type: AccountType;
  isAsset: boolean;
  startingBalance: number;
  currency: string;
  color?: string;
  institution?: string;
}

export interface UpdateAccountData {
  name?: string;
  color?: string | null;
  institution?: string | null;
  isActive?: boolean;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  icon: string | null;
  isIncome: boolean;
  parentId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  userId: string;
  name: string;
  color?: string;
  icon?: string;
  isIncome: boolean;
  parentId?: string;
}

export interface UpdateCategoryData {
  name?: string;
  color?: string | null;
  icon?: string | null;
  isActive?: boolean;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  /** AES-256-GCM encrypted at rest */
  description: string | null;
  /** AES-256-GCM encrypted at rest */
  payee: string | null;
  /** AES-256-GCM encrypted at rest */
  notes: string | null;
  date: Date;
  categoryId: string | null;
  isTransfer: boolean;
  isCleared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Decrypted shape returned in API responses */
export interface PublicTransaction
  extends Omit<Transaction, 'description' | 'payee' | 'notes'> {
  description: string | null;
  payee: string | null;
  notes: string | null;
}

export interface CreateTransactionData {
  userId: string;
  accountId: string;
  amount: number;
  description?: string;
  payee?: string;
  notes?: string;
  date: string; // ISO date string 'YYYY-MM-DD'
  categoryId?: string;
}

export interface UpdateTransactionData {
  accountId?: string;
  amount?: number;
  description?: string | null;
  payee?: string | null;
  notes?: string | null;
  date?: string;
  categoryId?: string | null;
  isCleared?: boolean;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  isTransfer?: boolean;
  page: number;
  limit: number;
}

// ─── Transaction Links ────────────────────────────────────────────────────────

export type LinkType = 'transfer' | 'payment' | 'refund';

export interface TransactionLink {
  id: string;
  fromTransactionId: string;
  toTransactionId: string;
  linkType: LinkType;
  createdAt: Date;
}

/** Auto-detected transfer candidate (computed, not a DB row) */
export interface TransferCandidate {
  transaction: PublicTransaction;
  account: Account;
}

// ─── Budgets ─────────────────────────────────────────────────────────────────

export interface Budget {
  id: string;
  userId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryId: string;
  allocatedAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategoryProgress {
  category: Category;
  allocated: number;
  spent: number;
  remaining: number;
}

export interface BudgetProgress {
  budget: Budget;
  categories: BudgetCategoryProgress[];
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
}

export interface CreateBudgetData {
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateBudgetData {
  name?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface BudgetCategoryEntry {
  categoryId: string;
  allocatedAmount: number;
}

// ─── Debt Schedules ───────────────────────────────────────────────────────────

export interface DebtSchedule {
  id: string;
  userId: string;
  accountId: string;
  /** Original loan amount */
  principal: number;
  /** Decimal fraction: 0.065 = 6.5% APR */
  annualRate: number;
  termMonths: number;
  originationDate: string; // YYYY-MM-DD
  paymentAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertDebtScheduleData {
  accountId: string;
  principal: number;
  annualRate: number;
  termMonths: number;
  originationDate: string;
  paymentAmount: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface AmortizationSchedule {
  schedule: AmortizationRow[];
  totalInterest: number;
  payoffDate: string; // YYYY-MM-DD
}

export interface WhatIfResult {
  originalPayoffDate: string;
  newPayoffDate: string;
  monthsSaved: number;
  interestSaved: number;
}

// ─── Transaction Splits ───────────────────────────────────────────────────────

export interface TransactionSplit {
  id: string;
  transactionId: string;
  principalAmount: number;
  interestAmount: number;
  createdAt: Date;
}

// ─── Savings Goals ────────────────────────────────────────────────────────────

export interface SavingsGoal {
  id: string;
  userId: string;
  accountId: string;
  name: string;
  targetAmount: number;
  targetDate: string | null; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSavingsGoalData {
  userId: string;
  accountId: string;
  name: string;
  targetAmount: number;
  targetDate?: string;
}

export interface UpdateSavingsGoalData {
  name?: string;
  targetAmount?: number;
  targetDate?: string | null;
}

export interface SavingsGoalProgress {
  goalId: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  percentComplete: number;
  daysToGoal: number | null;
  projectedDate: string | null; // YYYY-MM-DD
}

// ─── Forecast ─────────────────────────────────────────────────────────────────

export interface ForecastMonth {
  month: string; // YYYY-MM
  income: number;
  expenses: number;
  isForecast: true;
}
