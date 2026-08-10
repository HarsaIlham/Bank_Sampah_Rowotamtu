import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Memverifikasi hak akses...</p>
      </div>
    );
  }

  if (!allowedRoles.includes(currentRole)) {
    // If not logged in, redirect to login page
    if (currentRole === 'guest') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // If nasabah tries to access admin pages, redirect to nasabah dashboard
    if (currentRole === 'nasabah') {
      return <Navigate to="/nasabah" replace />;
    }
    // If admin tries to access nasabah-only routes, redirect to admin dashboard
    if (currentRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};

interface GuestOnlyRouteProps {
  children: React.ReactNode;
}

export const GuestOnlyRoute: React.FC<GuestOnlyRouteProps> = ({ children }) => {
  const { currentRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Memuat...</p>
      </div>
    );
  }

  if (currentRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (currentRole === 'nasabah') {
    return <Navigate to="/nasabah" replace />;
  }

  return <>{children}</>;
};
