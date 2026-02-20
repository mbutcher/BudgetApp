import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccounts } from '@features/core/hooks/useAccounts';
import { useTransactions } from '@features/core/hooks/useTransactions';
import { useBudgets, useBudgetProgress } from '@features/core/hooks/useBudgets';
import { useMonthlySummary, useForecast } from '@features/core/hooks/useReports';
import { useSavingsGoals, useSavingsGoalProgress } from '@features/core/hooks/useSavingsGoals';
import { AccountCard } from '@features/core/components/AccountCard';
import { MonthlyChart } from '@components/charts/MonthlyChart';
import type { Transaction, SavingsGoal } from '@features/core/types';
import type { MonthlySummaryEntry } from '@features/core/api/reportApi';

// ─── Summary card ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: string;
  valueColor?: string;
  isLoading?: boolean;
}

function SummaryCard({ label, value, valueColor = 'text-gray-900', isLoading }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      {isLoading ? (
        <div className="mt-1 h-7 w-28 bg-gray-100 animate-pulse rounded" />
      ) : (
        <p className={`mt-1 text-2xl font-bold tabular-nums ${valueColor}`}>{value}</p>
      )}
    </div>
  );
}

// ─── Recent transaction row ────────────────────────────────────────────────────

function TransactionRow({ tx }: { tx: Transaction }) {
  const isPositive = tx.amount > 0;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {tx.payee ?? tx.description ?? '—'}
        </p>
        <p className="text-xs text-gray-400">{tx.date}</p>
      </div>
      <p
        className={`ml-4 text-sm font-semibold tabular-nums flex-shrink-0 ${isPositive ? 'text-green-600' : 'text-gray-900'}`}
      >
        {isPositive ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
      </p>
    </div>
  );
}

// ─── Budget progress snapshot ──────────────────────────────────────────────────

function BudgetSnapshot({ budgetId }: { budgetId: string }) {
  const { data: progress, isLoading } = useBudgetProgress(budgetId);

  if (isLoading) {
    return <div className="h-16 bg-gray-100 animate-pulse rounded-lg" />;
  }
  if (!progress) return null;

  const pct =
    progress.totalAllocated > 0
      ? Math.min(100, (progress.totalSpent / progress.totalAllocated) * 100)
      : 0;
  const overBudget = progress.totalSpent > progress.totalAllocated;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Link
          to={`/budgets/${budgetId}`}
          className="text-sm font-medium text-gray-900 hover:underline"
        >
          {progress.budget.name}
        </Link>
        <span className={`text-xs font-semibold ${overBudget ? 'text-red-600' : 'text-gray-500'}`}>
          ${progress.totalSpent.toFixed(2)} / ${progress.totalAllocated.toFixed(2)}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${overBudget ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {progress.budget.startDate} – {progress.budget.endDate}
      </p>
    </div>
  );
}

// ─── Savings goal mini-card ────────────────────────────────────────────────────

function GoalMiniCard({ goal }: { goal: SavingsGoal }) {
  const { data: progress } = useSavingsGoalProgress(goal.id);
  const pct = progress?.percentComplete ?? 0;
  const current = progress?.currentAmount ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-gray-900 truncate">{goal.name}</p>
        <p className="ml-2 text-xs text-gray-500 flex-shrink-0">
          ${current.toFixed(0)} / ${goal.targetAmount.toFixed(0)}
        </p>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const [showForecast, setShowForecast] = useState(false);

  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: txData, isLoading: txLoading } = useTransactions({ limit: 5, page: 1 });
  const { data: budgets = [] } = useBudgets();
  const { data: monthlySummary = [], isLoading: summaryLoading } = useMonthlySummary(6);
  const { data: forecastData = [] } = useForecast(3);
  const { data: savingsGoals = [] } = useSavingsGoals();

  const activeAccounts = accounts.filter((a) => a.isActive);

  const netWorth = activeAccounts.reduce(
    (sum, a) => sum + (a.isAsset ? a.currentBalance : -a.currentBalance),
    0
  );

  // Current month totals: last entry in the summary array (ordered asc by month)
  const currentMonth = monthlySummary.length > 0 ? monthlySummary[monthlySummary.length - 1] : null;

  // Most recent active budget (latest startDate)
  const latestBudget =
    budgets.filter((b) => b.isActive).sort((a, b) => b.startDate.localeCompare(a.startDate))[0] ??
    null;

  const recentTransactions = txData?.data ?? [];

  const chartData: MonthlySummaryEntry[] = showForecast
    ? [...monthlySummary, ...forecastData]
    : monthlySummary;

  const topGoals = savingsGoals.slice(0, 3);

  const formatMoney = (n: number) =>
    `$${Math.abs(n).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Net Worth"
          value={`${netWorth < 0 ? '-' : ''}${formatMoney(netWorth)}`}
          valueColor={netWorth >= 0 ? 'text-gray-900' : 'text-red-600'}
          isLoading={accountsLoading}
        />
        <SummaryCard
          label="Income This Month"
          value={currentMonth ? formatMoney(currentMonth.income) : '$0.00'}
          valueColor="text-green-600"
          isLoading={summaryLoading}
        />
        <SummaryCard
          label="Expenses This Month"
          value={currentMonth ? formatMoney(currentMonth.expenses) : '$0.00'}
          isLoading={summaryLoading}
        />
      </div>

      {/* Accounts row */}
      {activeAccounts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Accounts</h2>
            <Link to="/accounts" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {activeAccounts.map((account) => (
              <div key={account.id} className="min-w-[220px]">
                <AccountCard account={account} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Monthly chart */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Income vs Expenses</h2>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showForecast}
              onChange={(e) => setShowForecast(e.target.checked)}
              className="rounded"
            />
            Show forecast
          </label>
        </div>
        {summaryLoading ? (
          <div className="h-60 bg-gray-100 animate-pulse rounded-lg" />
        ) : (
          <MonthlyChart data={chartData} />
        )}
        {showForecast && (
          <p className="mt-2 text-xs text-gray-400">Dimmed bars = projected based on last 6 months median.</p>
        )}
      </section>

      {/* Recent transactions + Budget snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent transactions */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {txLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No transactions yet.</p>
          ) : (
            <div>
              {recentTransactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </section>

        {/* Budget snapshot */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Budget</h2>
            <Link to="/budgets" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {latestBudget ? (
            <BudgetSnapshot budgetId={latestBudget.id} />
          ) : (
            <p className="text-sm text-gray-400 py-6 text-center">No active budgets.</p>
          )}
        </section>
      </div>

      {/* Savings goals widget */}
      {topGoals.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Savings Goals</h2>
            <Link to="/savings-goals" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {topGoals.map((goal) => (
              <GoalMiniCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
