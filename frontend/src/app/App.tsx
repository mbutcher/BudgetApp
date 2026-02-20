import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';
import { ProtectedRoute } from '@features/auth/components/ProtectedRoute';
import { AppLayout } from '@components/layout/AppLayout';
import { LoginPage } from '@features/auth/pages/LoginPage';
import { TwoFactorPage } from '@features/auth/pages/TwoFactorPage';
import { RegisterPage } from '@features/auth/pages/RegisterPage';
import { SecuritySettingsPage } from '@features/auth/pages/SecuritySettingsPage';
import { DashboardPage } from '@features/dashboard/pages/DashboardPage';
import { AccountsPage } from '@features/core/pages/AccountsPage';
import { TransactionsPage } from '@features/core/pages/TransactionsPage';
import { BudgetListPage } from '@features/core/pages/BudgetListPage';
import { BudgetDetailPage } from '@features/core/pages/BudgetDetailPage';
import { DebtDetailPage } from '@features/core/pages/DebtDetailPage';
import { SavingsGoalsPage } from '@features/core/pages/SavingsGoalsPage';

/**
 * AuthInitializer calls GET /auth/me on mount to restore session from
 * the httpOnly refresh cookie (via silent token refresh in the Axios interceptor).
 */
function AuthInitializer() {
  useAuth();
  return null;
}

function App() {
  return (
    <>
      <AuthInitializer />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/two-factor" element={<TwoFactorPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected layout route — all children share AppLayout sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetListPage />} />
          <Route path="/budgets/:id" element={<BudgetDetailPage />} />
          <Route path="/accounts/:accountId/debt" element={<DebtDetailPage />} />
          <Route path="/savings-goals" element={<SavingsGoalsPage />} />
          <Route path="/settings/security" element={<SecuritySettingsPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
