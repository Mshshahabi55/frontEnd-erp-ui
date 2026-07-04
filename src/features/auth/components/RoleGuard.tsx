import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  fallbackPath?: string;
}

export const RoleGuard = ({
  children,
  allowedRoles = [],
  allowedPermissions = [],
  fallbackPath = '/unauthorized',
}: RoleGuardProps) => {
  const { user, hasPermission, hasRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some((role) => hasRole(role));
    if (!hasAllowedRole) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  if (allowedPermissions.length > 0) {
    const hasAllowedPermission = allowedPermissions.some((permission) =>
      hasPermission(permission)
    );
    if (!hasAllowedPermission) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return <>{children}</>;
};