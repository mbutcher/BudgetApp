import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  Target,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { authApi } from '@features/auth/api/authApi';
import { useAuthStore } from '@features/auth/stores/authStore';
import { Button } from '@components/ui/button';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: Wallet, label: 'Accounts' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/budgets', icon: PiggyBank, label: 'Budgets' },
  { to: '/savings-goals', icon: Target, label: 'Savings Goals' },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, clearAuth } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-lg font-bold tracking-tight text-gray-900">BudgetApp</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNav}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: settings + user + logout */}
      <div className="px-3 pb-4 space-y-1 border-t border-gray-100 pt-3">
        <NavLink
          to="/settings/security"
          onClick={onNav}
          className={({ isActive }) =>
            [
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            ].join(' ')
          }
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </NavLink>

        <div className="px-3 py-2">
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-3 text-gray-600"
          isLoading={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:shrink-0 bg-white border-r border-gray-100">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-100 transition-transform duration-200 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <SidebarContent onNav={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-auto">
        {/* Mobile top bar */}
        <header className="flex items-center h-14 px-4 border-b border-gray-100 bg-white md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 text-sm font-bold text-gray-900">BudgetApp</span>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto p-1 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
