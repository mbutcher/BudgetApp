import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const location = useLocation();

  // Still performing initial auth check — render nothing to avoid flash
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Redirect to household setup if the user has no household yet
  // (skip redirect if already on /setup to avoid redirect loop)
  if (user?.householdSetupRequired && location.pathname !== '/setup') {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}
