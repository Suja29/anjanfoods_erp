import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { canAccess } from '@/lib/permissions';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-navy-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function RoleRoute({ children, roles }: { children: ReactNode; roles: string[] }) {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile || !roles.includes(profile.role)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  if (!canAccess(profile.role, location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
