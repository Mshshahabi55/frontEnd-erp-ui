import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner/LoadingSpinner';

interface ProtectedRouteProps {
  requiredPermission?: string;
  requiredRole?: string;
}

export const ProtectedRoute = ({ requiredPermission, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};