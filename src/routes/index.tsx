import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { MainLayout } from '@/layouts/MainLayout/MainLayout';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner/LoadingSpinner';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const CustomersPage = lazy(() => import('@/features/customers/pages/CustomersPage'));
const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage'));
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage'));

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
    <Component />
  </Suspense>
);

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={withSuspense(LoginPage)} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={withSuspense(DashboardPage)} />
          <Route path="/customers" element={withSuspense(CustomersPage)} />
          <Route path="/products" element={withSuspense(ProductsPage)} />
          <Route path="/orders" element={withSuspense(OrdersPage)} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};