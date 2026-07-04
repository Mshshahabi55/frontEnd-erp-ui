import { useMemo } from 'react';
import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    return {
      canViewCustomers: user?.permissions.includes('view_customers') ?? false,
      canCreateCustomers: user?.permissions.includes('create_customers') ?? false,
      canEditCustomers: user?.permissions.includes('edit_customers') ?? false,
      canDeleteCustomers: user?.permissions.includes('delete_customers') ?? false,
      canViewProducts: user?.permissions.includes('view_products') ?? false,
      canCreateProducts: user?.permissions.includes('create_products') ?? false,
      canEditProducts: user?.permissions.includes('edit_products') ?? false,
      canDeleteProducts: user?.permissions.includes('delete_products') ?? false,
      canViewOrders: user?.permissions.includes('view_orders') ?? false,
      canCreateOrders: user?.permissions.includes('create_orders') ?? false,
      canEditOrders: user?.permissions.includes('edit_orders') ?? false,
      canDeleteOrders: user?.permissions.includes('delete_orders') ?? false,
      canViewDashboard: user?.permissions.includes('view_dashboard') ?? false,
      canManageUsers: user?.permissions.includes('manage_users') ?? false,
      canViewReports: user?.permissions.includes('view_reports') ?? false,
    };
  }, [user]);

  return permissions;
};